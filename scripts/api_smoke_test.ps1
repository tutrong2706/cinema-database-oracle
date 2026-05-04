$ErrorActionPreference = 'Stop'

function Run-Test {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [int[]]$ExpectedStatuses = @(200)
    )

    $result = [ordered]@{
        Name = $Name
        Method = $Method
        Url = $Url
        Expected = ($ExpectedStatuses -join ',')
        Status = $null
        Passed = $false
        Message = ''
    }

    try {
        $params = @{ Uri = $Url; Method = $Method; UseBasicParsing = $true; Headers = $Headers }
        if ($null -ne $Body) {
            $params.ContentType = 'application/json'
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }

        $resp = Invoke-WebRequest @params
        $result.Status = [int]$resp.StatusCode
        $result.Passed = $ExpectedStatuses -contains [int]$resp.StatusCode
        $result.Message = 'OK'
    }
    catch {
        $status = -1
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            $status = [int]$_.Exception.Response.StatusCode
        }
        $msg = if ($_.ErrorDetails.Message) { $_.ErrorDetails.Message } else { $_.Exception.Message }
        $result.Status = $status
        $result.Passed = $ExpectedStatuses -contains $status
        $result.Message = $msg
    }

    return [PSCustomObject]$result
}

$base = 'http://localhost:3069'
$tests = @()

$adminToken = $null
$custToken = $null

try {
    $adminLogin = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email = 'admin@cinema.com'; password = 'admin123456' } | ConvertTo-Json)
    if ($adminLogin -and $adminLogin.meta -and $adminLogin.meta.token) { $adminToken = $adminLogin.meta.token }
}
catch {}

try {
    $custLogin = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email = 'nguyenvana@gmail.com'; password = 'password123' } | ConvertTo-Json)
    if ($custLogin -and $custLogin.meta -and $custLogin.meta.token) { $custToken = $custLogin.meta.token }
}
catch {}

$adminHeaders = @{}
$custHeaders = @{}
if ($adminToken) { $adminHeaders.Authorization = "Bearer $adminToken" }
if ($custToken) { $custHeaders.Authorization = "Bearer $custToken" }

$tests += Run-Test -Name 'Root' -Method 'GET' -Url "$base/" -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Swagger' -Method 'GET' -Url "$base/api-docs" -ExpectedStatuses @(200)
$tests += Run-Test -Name 'API Health' -Method 'GET' -Url "$base/api/health" -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Movies list' -Method 'GET' -Url "$base/api/phim" -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Movies search' -Method 'GET' -Url "$base/api/phim/search?keyword=avengers" -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Movie detail' -Method 'GET' -Url "$base/api/phim/PH001" -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Movie reviews' -Method 'GET' -Url "$base/api/phim/PH001/reviews" -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Cinemas' -Method 'GET' -Url "$base/api/auth/raps" -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Combos' -Method 'GET' -Url "$base/api/auth/combos" -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Screenings with MaPhim' -Method 'GET' -Url "$base/api/auth/suat-chieus?MaPhim=PH001" -ExpectedStatuses @(200)

$screeningId = $null
try {
    $screeningResp = Invoke-RestMethod -Uri "$base/api/auth/suat-chieus?MaPhim=PH001" -Method Get
    if ($screeningResp.meta -and $screeningResp.meta.Count -gt 0) {
        $first = $screeningResp.meta[0]
        if ($first.MASUATCHIEU) { $screeningId = $first.MASUATCHIEU }
        elseif ($first.MaSuatChieu) { $screeningId = $first.MaSuatChieu }
    }
}
catch {}
if (-not $screeningId) { $screeningId = 'SC001' }

$tests += Run-Test -Name 'Booked seats by screening' -Method 'GET' -Url "$base/api/auth/suat-chieus/$screeningId/booked-seats" -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Auth profile no token' -Method 'GET' -Url "$base/api/auth/profile" -ExpectedStatuses @(401)
$tests += Run-Test -Name 'Admin movies no token' -Method 'GET' -Url "$base/api/admin/phims" -ExpectedStatuses @(401)
$tests += Run-Test -Name 'Customer profile with token' -Method 'GET' -Url "$base/api/auth/profile" -Headers $custHeaders -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Customer orders with token' -Method 'GET' -Url "$base/api/auth/orders" -Headers $custHeaders -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Customer tickets with token' -Method 'GET' -Url "$base/api/auth/tickets" -Headers $custHeaders -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Admin movies with customer token (forbid)' -Method 'GET' -Url "$base/api/admin/phims" -Headers $custHeaders -ExpectedStatuses @(403)
$tests += Run-Test -Name 'Admin movies with admin token' -Method 'GET' -Url "$base/api/admin/phims" -Headers $adminHeaders -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Admin screenings with admin token' -Method 'GET' -Url "$base/api/admin/suats" -Headers $adminHeaders -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Admin orders with admin token' -Method 'GET' -Url "$base/api/admin/orders" -Headers $adminHeaders -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Admin revenue with admin token' -Method 'GET' -Url "$base/api/admin/revenue" -Headers $adminHeaders -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Admin users with admin token' -Method 'GET' -Url "$base/api/admin/users" -Headers $adminHeaders -ExpectedStatuses @(200)
$tests += Run-Test -Name 'Admin users count with admin token' -Method 'GET' -Url "$base/api/admin/users/count" -Headers $adminHeaders -ExpectedStatuses @(200)

$summary = [ordered]@{
    total = $tests.Count
    passed = ($tests | Where-Object { $_.Passed }).Count
    failed = ($tests | Where-Object { -not $_.Passed }).Count
    adminLoginOk = [bool]$adminToken
    customerLoginOk = [bool]$custToken
    screeningIdUsed = $screeningId
}

[PSCustomObject]@{
    summary = $summary
    results = $tests
} | ConvertTo-Json -Depth 8
