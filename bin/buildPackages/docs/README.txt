EDIT THIS...

This folder contains three subfolders.

Embed folder
This contains a readme.txt file with the embed code and instructions. This is the recommended way to deploy the graphic.

Production folder
A minified production version of the graphic, if you wish to simply host it as is on your own servers.
If you prefer to host the graphic on your own server and then embed that hosted graphic on your site,  follow the instructions in the embed folder.

Development folder
A non-minified version of the interactive. This is available for users who want to customize the graphic. The javascript and css are compiled into single files, but not minified.

Source folder
For more advanced developers.  This folder can be run as an app, and is much easier for high level customizations. You must have node installed on your computer, as well as node packages bower, gulp and yarn. After installing node, run XXX npm install -g yarn gulp bower XXX in the terminal.
    To run the app:
        --navigate to the folder in your terminal
        --type these commands
            --yarn
            --bower install
        --there are a series of gulp commands for serving or minifying the project
            --gulp serve
            --gulp build
    Translations:
    Interactives are built to be translatable.  All language is in the locale/en/messages.po
        --if you wish to translate, change the msgstr lines in messages.po.  Do not adjust the msgid, that should stay in english.
        --there is built in language support for a number of languages that will handle dates, months, currency and commas inside of charts.
            --in messages.po you can change the msgstr for "language_id" and "en" to any of the following to change the language inside of charts
                --es
                --fr
                --ch
                --pt
            --if your language is not available, please contact us and we will gladly include it in all graphics moving forward.
Querry strings
The header and footer are automatically removed when a graphic is embedded.  However if you would like to remove them without embedding, there are querry strings available for that
    URL_TO_GRAPHIC ?header=no
