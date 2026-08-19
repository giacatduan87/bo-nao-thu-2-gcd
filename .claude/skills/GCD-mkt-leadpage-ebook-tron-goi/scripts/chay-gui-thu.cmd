@echo off
REM Chay script gui ebook bang Lark Mail.
REM GIU FILE NAY THUAN ASCII: Windows chay codepage CP1252,
REM chu tieng Viet co dau trong file .cmd se bi hong.
cd /d "%~dp0"
"C:\Program Files\nodejs\node.exe" gui-thu-lark.mjs
exit /b %ERRORLEVEL%
