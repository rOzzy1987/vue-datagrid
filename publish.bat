@echo OFF
set CHANGES=""
FOR /F "delims=" %%i IN ('git status -s') DO IF NOT [%%i] == [] GOTO Change

:NoChanges
echo No changes. Going on...
@REM npm publish --access public

:Change
echo Changes present
:End