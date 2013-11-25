    # $ext_path: This should be the path of the Ext JS SDK relative to this file

    # sass_path: the directory your Sass files are in. THIS file should also be in the Sass folder
    # Generally this will be in a resources/sass folder
    # <root>/resources/sass
    root = File.dirname(__FILE__)

    project_path = File.expand_path(File.join(root, '..', '..'))

    sass_path = File.join(root)
    css_path = "../../media/css-build"

    # You can select your preferred output style here (can be overridden via the command line):
    # output_style = :expanded or :nested or :compact or :compressed
    output_style=:expanded

    # We need to load our product images
    load File.join(root, 'media/img')
    fonts_dir = "../fonts"
