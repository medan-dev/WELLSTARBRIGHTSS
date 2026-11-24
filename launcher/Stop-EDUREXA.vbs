' ============================================================
' EDUREXA — Stop Server
' Kills the background Node.js server and cleans up.
' ============================================================

Option Explicit

Dim objShell, objFSO, strProjectDir, strPidFile

Set objShell = CreateObject("WScript.Shell")
Set objFSO   = CreateObject("Scripting.FileSystemObject")

strProjectDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
strProjectDir = objFSO.GetParentFolderName(strProjectDir)
strPidFile    = strProjectDir & "\launcher\server.pid"

' Kill all node processes that are serving our port
objShell.Run "cmd /c for /f ""tokens=5"" %a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %a", 0, True

' Remove PID sentinel
If objFSO.FileExists(strPidFile) Then
    objFSO.DeleteFile strPidFile
End If

MsgBox "EDUREXA server stopped.", 64, "EDUREXA Launcher"

Set objShell = Nothing
Set objFSO   = Nothing
