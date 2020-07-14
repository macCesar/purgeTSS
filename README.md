# purgeTSS

Creates a clean app.tss file by combining your own base.tss file and only the use classes from [tailwind.tss](https://github.com/macCesar/tailwind-tss-color-generator/blob/master/app.tss) and [fontawesome.tss](https://github.com/macCesar/tailwind-tss-color-generator/blob/master/fontawesome.tss).

purgeTSS will scan your xml files and will copy only the used classes into app.tss.

# Warning!
- ### This script will OVERWRITE your existing app.tss file
  > 
  > Please rename your existing app.tss file to base.tss. PurgeTSS will combine it along with tailwind.tss and fontawesome.tss files.
