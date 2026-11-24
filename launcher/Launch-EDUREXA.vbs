' ============================================================
' EDUREXA School Management System — Silent Launcher
' Double-click this file to start the web app invisibly.
' No terminal window will appear.
' ============================================================

Option Explicit

Dim objShell, objFSO, strProjectDir, strNodeCmd, strBrowser
Dim strLogFile, strPidFile, intPort, intWait, i
Dim objHTTP, strURL, bReady

Set objShell = CreateObject("WScript.Shell")
Set objFSO   = CreateObject("Scripting.FileSystemObject")

' ---- CONFIG ------------------------------------------------
strProjectDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
strProjectDir = objFSO.GetParentFolderName(strProjectDir)   ' go up from \launcher\
intPort       = 3000
strURL        = "http://localhost:" & intPort
strLogFile    = strProjectDir & "\launcher\server.log"
strPidFile    = strProjectDir & "\launcher\server.pid"
' ------------------------------------------------------------

' Check if already running
If objFSO.FileExists(strPidFile) Then
    Dim objPidFile, strPid
    Set objPidFile = objFSO.OpenTextFile(strPidFile, 1)
    strPid = Trim(objPidFile.ReadLine)
    objPidFile.Close
    ' Try opening the browser directly — server may already be up
    objShell.Run "cmd /c start " & strURL, 0, False
    WScript.Quit
End If

' Start Next.js server silently (window hidden = 0)
Dim strCmd
strCmd = "cmd /c cd /d """ & strProjectDir & """ && npm run start > """ & strLogFile & """ 2>&1"
objShell.Run strCmd, 0, False   ' 0 = hidden window, False = don't wait

' Save a sentinel file so we know something launched
Dim objOut
Set objOut = objFSO.CreateTextFile(strPidFile, True)
objOut.WriteLine "launched"
objOut.Close

' Wait for server to become ready (up to 60 seconds)
Set objHTTP = CreateObject("MSXML2.ServerXMLHTTP")
bReady = False
For i = 1 To 60
    WScript.Sleep 1000
    On Error Resume Next
    objHTTP.open "GET", strURL, False
    objHTTP.send
    If Err.Number = 0 Then
        If objHTTP.status = 200 Then
            bReady = True
            Exit For
        End If
    End If
    Err.Clear
    On Error GoTo 0
Next

' Open the browser
If bReady Then
    objShell.Run "cmd /c start " & strURL, 0, False
Else
    ' Server took too long — open anyway, may still load
    objShell.Run "cmd /c start " & strURL, 0, False
End If

Set objShell = Nothing
Set objFSO   = Nothing
Set objHTTP  = Nothing
