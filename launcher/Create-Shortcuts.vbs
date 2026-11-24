' ============================================================
' Create Desktop + Start Menu shortcuts for EDUREXA
' Run this ONCE after installing to place shortcuts.
' ============================================================

Option Explicit

Dim objShell, objFSO, strLauncherDir, strVbs, strIco
Dim strDesktop, strStartMenu, oLink

Set objShell    = CreateObject("WScript.Shell")
Set objFSO      = CreateObject("Scripting.FileSystemObject")

strLauncherDir  = objFSO.GetParentFolderName(WScript.ScriptFullName)
strVbs          = strLauncherDir & "\Launch-EDUREXA.vbs"
strIco          = objFSO.GetParentFolderName(strLauncherDir) & "\public\logo.png"

' Desktop
strDesktop = objShell.SpecialFolders("Desktop")
Set oLink = objShell.CreateShortcut(strDesktop & "\EDUREXA School System.lnk")
oLink.TargetPath       = "wscript.exe"
oLink.Arguments        = """" & strVbs & """"
oLink.WorkingDirectory = objFSO.GetParentFolderName(strLauncherDir)
oLink.Description      = "Launch EDUREXA School Management System"
oLink.Save

' Start Menu
strStartMenu = objShell.SpecialFolders("StartMenu") & "\Programs"
If Not objFSO.FolderExists(strStartMenu & "\EDUREXA") Then
    objFSO.CreateFolder strStartMenu & "\EDUREXA"
End If
Set oLink = objShell.CreateShortcut(strStartMenu & "\EDUREXA\EDUREXA School System.lnk")
oLink.TargetPath       = "wscript.exe"
oLink.Arguments        = """" & strVbs & """"
oLink.WorkingDirectory = objFSO.GetParentFolderName(strLauncherDir)
oLink.Description      = "Launch EDUREXA School Management System"
oLink.Save

Set oLink = objShell.CreateShortcut(strStartMenu & "\EDUREXA\Stop EDUREXA Server.lnk")
oLink.TargetPath       = "wscript.exe"
oLink.Arguments        = """" & strLauncherDir & "\Stop-EDUREXA.vbs"""
oLink.WorkingDirectory = objFSO.GetParentFolderName(strLauncherDir)
oLink.Description      = "Stop the EDUREXA background server"
oLink.Save

MsgBox "Shortcuts created!" & vbCrLf & vbCrLf & _
       "Desktop: EDUREXA School System" & vbCrLf & _
       "Start Menu: EDUREXA > EDUREXA School System", 64, "EDUREXA Setup"

Set objShell = Nothing
Set objFSO   = Nothing
