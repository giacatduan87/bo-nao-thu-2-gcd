' Chay chay-gui-thu.cmd O CHE DO AN, khong nhay cua so den moi lan quet.
' Tham so thu 2 = 0 nghia la cua so bi giau; True nghia la cho chay xong roi thoat.
' Dat file NAY (khong phai file .cmd) vao Task Scheduler.
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
thuMuc = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = thuMuc
sh.Run """" & thuMuc & "\chay-gui-thu.cmd""", 0, True
