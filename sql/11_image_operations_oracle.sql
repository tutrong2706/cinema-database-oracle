-- ORACLE VERSION: Image Management for Movie Posters
-- ============================================================================

-- TABLE: Image storage and management
CREATE TABLE PHIM_IMAGES (
    ImageID         NUMBER PRIMARY KEY,
    MaPhim          VARCHAR2(20) NOT NULL,
    ImageURL        VARCHAR2(500),
    ImagePath       VARCHAR2(500),
    ImageSize       NUMBER,
    ImageFormat     VARCHAR2(50),
    ThuTu           NUMBER,
    LaDinhDanh      CHAR(1) DEFAULT 'N',
    NgayThem        TIMESTAMP DEFAULT SYSDATE,
    FOREIGN KEY (MaPhim) REFERENCES PHIM(MaPhim) ON DELETE CASCADE
);

-- TABLE: User profile images
CREATE TABLE NGUOI_DUNG_IMAGES (
    ImageID         NUMBER PRIMARY KEY,
    MaNguoiDung     VARCHAR2(20) NOT NULL,
    ImageURL        VARCHAR2(500),
    ImagePath       VARCHAR2(500),
    ImageSize       NUMBER,
    ImageFormat     VARCHAR2(50),
    NgayThem        TIMESTAMP DEFAULT SYSDATE,
    FOREIGN KEY (MaNguoiDung) REFERENCES NGUOI_DUNG(MaNguoiDung) ON DELETE CASCADE
);

-- Create sequence for image IDs
CREATE SEQUENCE seq_PhimImages_ID
    START WITH 1
    INCREMENT BY 1
    NOCYCLE;

CREATE SEQUENCE seq_NguoiDungImages_ID
    START WITH 1
    INCREMENT BY 1
    NOCYCLE;

-- Procedure to upload movie image
CREATE OR REPLACE PROCEDURE SP_UploadPhimImage (
    p_MaPhim        IN VARCHAR2,
    p_ImageURL      IN VARCHAR2,
    p_ImagePath     IN VARCHAR2,
    p_ImageSize     IN NUMBER,
    p_ImageFormat   IN VARCHAR2,
    p_ThuTu         IN NUMBER DEFAULT 1,
    p_LaDinhDanh    IN CHAR1 DEFAULT 'N'
)
AS
    v_ImageID   NUMBER;
BEGIN
    -- Check if movie exists
    IF (SELECT COUNT(*) FROM PHIM WHERE MaPhim = p_MaPhim) = 0 THEN
        RAISE_APPLICATION_ERROR(-20040, 'Movie does not exist.');
    END IF;

    -- Validate file format
    IF p_ImageFormat NOT IN ('jpg', 'jpeg', 'png', 'gif', 'webp') THEN
        RAISE_APPLICATION_ERROR(-20041, 'Unsupported image format.');
    END IF;

    -- Validate file size (max 5MB)
    IF p_ImageSize > 5242880 THEN
        RAISE_APPLICATION_ERROR(-20042, 'Image file too large (max 5MB).');
    END IF;

    -- Get next image ID
    SELECT seq_PhimImages_ID.NEXTVAL INTO v_ImageID FROM DUAL;

    -- Insert image record
    INSERT INTO PHIM_IMAGES (
        ImageID, MaPhim, ImageURL, ImagePath, ImageSize, ImageFormat, 
        ThuTu, LaDinhDanh, NgayThem
    )
    VALUES (
        v_ImageID, p_MaPhim, p_ImageURL, p_ImagePath, p_ImageSize, 
        p_ImageFormat, p_ThuTu, p_LaDinhDanh, SYSDATE
    );

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Image uploaded successfully. ID: ' || v_ImageID);
END SP_UploadPhimImage;
/

-- Procedure to set primary image for movie
CREATE OR REPLACE PROCEDURE SP_SetPhimPrimaryImage (
    p_MaPhim    IN VARCHAR2,
    p_ImageID   IN NUMBER
)
AS
BEGIN
    -- Remove previous primary image
    UPDATE PHIM_IMAGES 
    SET LaDinhDanh = 'N'
    WHERE MaPhim = p_MaPhim;

    -- Set new primary image
    UPDATE PHIM_IMAGES
    SET LaDinhDanh = 'Y'
    WHERE ImageID = p_ImageID AND MaPhim = p_MaPhim;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20043, 'Image not found.');
    END IF;

    COMMIT;
END SP_SetPhimPrimaryImage;
/

-- Procedure to get all images for a movie
CREATE OR REPLACE PROCEDURE SP_GetPhimImages (
    p_MaPhim IN VARCHAR2
)
AS
BEGIN
    SELECT 
        ImageID,
        MaPhim,
        ImageURL,
        ImagePath,
        ImageSize,
        ImageFormat,
        ThuTu,
        LaDinhDanh,
        NgayThem
    FROM PHIM_IMAGES
    WHERE MaPhim = p_MaPhim
    ORDER BY LaDinhDanh DESC, ThuTu ASC;
END SP_GetPhimImages;
/

-- Procedure to get primary image for movie
CREATE OR REPLACE PROCEDURE SP_GetPhimPrimaryImage (
    p_MaPhim IN VARCHAR2
)
AS
BEGIN
    SELECT 
        ImageID,
        ImageURL,
        ImagePath,
        ImageFormat,
        NgayThem
    FROM PHIM_IMAGES
    WHERE MaPhim = p_MaPhim AND LaDinhDanh = 'Y'
    FETCH FIRST 1 ROW ONLY;
END SP_GetPhimPrimaryImage;
/

-- Procedure to delete image
CREATE OR REPLACE PROCEDURE SP_DeletePhimImage (
    p_ImageID IN NUMBER
)
AS
BEGIN
    DELETE FROM PHIM_IMAGES WHERE ImageID = p_ImageID;
    
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20043, 'Image not found.');
    END IF;
    
    COMMIT;
END SP_DeletePhimImage;
/

-- Procedure to upload user profile image
CREATE OR REPLACE PROCEDURE SP_UploadUserImage (
    p_MaNguoiDung   IN VARCHAR2,
    p_ImageURL      IN VARCHAR2,
    p_ImagePath     IN VARCHAR2,
    p_ImageSize     IN NUMBER,
    p_ImageFormat   IN VARCHAR2
)
AS
    v_ImageID   NUMBER;
BEGIN
    -- Check if user exists
    IF (SELECT COUNT(*) FROM NGUOI_DUNG WHERE MaNguoiDung = p_MaNguoiDung) = 0 THEN
        RAISE_APPLICATION_ERROR(-20044, 'User does not exist.');
    END IF;

    -- Validate file format
    IF p_ImageFormat NOT IN ('jpg', 'jpeg', 'png', 'gif', 'webp') THEN
        RAISE_APPLICATION_ERROR(-20041, 'Unsupported image format.');
    END IF;

    -- Validate file size (max 2MB)
    IF p_ImageSize > 2097152 THEN
        RAISE_APPLICATION_ERROR(-20045, 'Profile image too large (max 2MB).');
    END IF;

    -- Delete previous profile image if exists
    DELETE FROM NGUOI_DUNG_IMAGES WHERE MaNguoiDung = p_MaNguoiDung;

    -- Get next image ID
    SELECT seq_NguoiDungImages_ID.NEXTVAL INTO v_ImageID FROM DUAL;

    -- Insert new image
    INSERT INTO NGUOI_DUNG_IMAGES (
        ImageID, MaNguoiDung, ImageURL, ImagePath, ImageSize, ImageFormat, NgayThem
    )
    VALUES (
        v_ImageID, p_MaNguoiDung, p_ImageURL, p_ImagePath, p_ImageSize, 
        p_ImageFormat, SYSDATE
    );

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Profile image uploaded successfully. ID: ' || v_ImageID);
END SP_UploadUserImage;
/

-- Procedure to get user profile image
CREATE OR REPLACE PROCEDURE SP_GetUserImage (
    p_MaNguoiDung IN VARCHAR2
)
AS
BEGIN
    SELECT 
        ImageID,
        ImageURL,
        ImagePath,
        ImageFormat,
        NgayThem
    FROM NGUOI_DUNG_IMAGES
    WHERE MaNguoiDung = p_MaNguoiDung;
END SP_GetUserImage;
/

-- Function to get image URL for movie
CREATE OR REPLACE FUNCTION FUNC_GetPhimImageURL(p_MaPhim IN VARCHAR2)
RETURN VARCHAR2
DETERMINISTIC
IS
    v_ImageURL VARCHAR2(500);
BEGIN
    SELECT ImageURL INTO v_ImageURL
    FROM PHIM_IMAGES
    WHERE MaPhim = p_MaPhim AND LaDinhDanh = 'Y'
    FETCH FIRST 1 ROW ONLY;

    RETURN NVL(v_ImageURL, '/images/default-poster.jpg');
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN '/images/default-poster.jpg';
END FUNC_GetPhimImageURL;
/

-- View: All images with metadata
CREATE OR REPLACE VIEW V_PHIM_IMAGES_FULL AS
SELECT 
    pi.ImageID,
    p.MaPhim,
    p.TenPhim,
    pi.ImageURL,
    pi.ImagePath,
    ROUND(pi.ImageSize / 1024, 2) AS ImageSizeKB,
    pi.ImageFormat,
    pi.ThuTu,
    pi.LaDinhDanh,
    pi.NgayThem,
    (SELECT COUNT(*) FROM PHIM_IMAGES WHERE MaPhim = p.MaPhim) AS TotalImages
FROM PHIM_IMAGES pi
JOIN PHIM p ON pi.MaPhim = p.MaPhim;
/

-- Trigger to validate image operations
CREATE OR REPLACE TRIGGER TRG_PhimImages_Validate
BEFORE INSERT ON PHIM_IMAGES
FOR EACH ROW
BEGIN
    -- Ensure at least one image is marked as primary if it's the first
    IF (SELECT COUNT(*) FROM PHIM_IMAGES WHERE MaPhim = :NEW.MaPhim) = 0 THEN
        :NEW.LaDinhDanh := 'Y';
    END IF;
END TRG_PhimImages_Validate;
/

BEGIN
    DBMS_OUTPUT.PUT_LINE('Image management tables and procedures created successfully!');
END;
/
