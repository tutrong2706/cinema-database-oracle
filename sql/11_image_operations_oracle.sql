-- ORACLE VERSION: Image Management for Movie Posters
-- ============================================================================
-- Simplified: Use existing Anh column in PHIM table instead of separate tables
-- ============================================================================

-- Procedure to update movie poster image
CREATE OR REPLACE PROCEDURE SP_UpdatePhimImage (
    p_MaPhim    IN VARCHAR2,
    p_ImageURL  IN VARCHAR2
)
AS
    v_count NUMBER;
BEGIN
    -- Check if movie exists
    SELECT COUNT(*) INTO v_count FROM PHIM WHERE MaPhim = p_MaPhim;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20040, 'Movie does not exist.');
    END IF;

    -- Validate URL format (basic check)
    IF p_ImageURL IS NULL OR LENGTH(p_ImageURL) = 0 THEN
        RAISE_APPLICATION_ERROR(-20046, 'Image URL cannot be empty.');       
    END IF;

    -- Update movie image
    UPDATE PHIM
    SET Anh = p_ImageURL
    WHERE MaPhim = p_MaPhim;

    DBMS_OUTPUT.PUT_LINE('Movie image updated successfully for MaPhim: ' || p_MaPhim);
END SP_UpdatePhimImage;
/

-- Procedure to get movie image
CREATE OR REPLACE PROCEDURE SP_GetPhimImage (
    p_MaPhim IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
)
AS
    v_count NUMBER;
BEGIN
    -- Check if movie exists
    SELECT COUNT(*) INTO v_count FROM PHIM WHERE MaPhim = p_MaPhim;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20040, 'Movie does not exist.');
    END IF;

    OPEN p_cursor FOR
    SELECT
        MaPhim,
        TenPhim,
        Anh AS ImageURL,
        CASE
            WHEN Anh IS NULL THEN '/images/default-poster.jpg'
            ELSE Anh
        END AS DisplayImageURL
    FROM PHIM
    WHERE MaPhim = p_MaPhim;
END SP_GetPhimImage;
/

-- Function to get image URL for movie (with default fallback)
CREATE OR REPLACE FUNCTION FUNC_GetPhimImageURL(p_MaPhim IN VARCHAR2)
RETURN VARCHAR2
DETERMINISTIC
IS
    v_ImageURL VARCHAR2(500);
BEGIN
    SELECT NVL(Anh, '/images/default-poster.jpg') INTO v_ImageURL
    FROM PHIM
    WHERE MaPhim = p_MaPhim;

    RETURN v_ImageURL;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN '/images/default-poster.jpg';
END FUNC_GetPhimImageURL;
/

-- View: All movies with image metadata
CREATE OR REPLACE VIEW V_PHIM_IMAGES_FULL AS
SELECT 
    p.MaPhim,
    p.TenPhim,
    p.Anh AS ImageURL,
    NVL(p.Anh, '/images/default-poster.jpg') AS DisplayImageURL,
    p.DaoDien,
    p.NgayKhoiChieu,
    CASE 
        WHEN p.Anh IS NULL THEN 'No Image'
        ELSE 'Has Image'
    END AS ImageStatus
FROM PHIM p;
/

-- Trigger to validate image URL on update
CREATE OR REPLACE TRIGGER TRG_PHIM_ValidateImage
BEFORE UPDATE ON PHIM
FOR EACH ROW
BEGIN
    -- If Anh is being updated and is not null, validate format
    IF :NEW.Anh IS NOT NULL AND :NEW.Anh <> :OLD.Anh THEN
        IF LENGTH(:NEW.Anh) > 500 THEN
            RAISE_APPLICATION_ERROR(-20047, 'Image URL is too long (max 500 characters).');
        END IF;
    END IF;
END TRG_PHIM_ValidateImage;
/

BEGIN
    DBMS_OUTPUT.PUT_LINE('Image management procedures and functions created successfully!');
END;
/
