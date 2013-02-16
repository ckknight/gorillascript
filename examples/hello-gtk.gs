#!/usr/bin/env gjs-gorilla

// This is a Hello World program that runs on Gtk using Gjs (GNOME JavaScript bindings)

let {Gtk, GLib} = imports.gi

// Initialize the gtk
Gtk.init null, 0

let mwindow = new Gtk.Window type: Gtk.WindowType.TOPLEVEL
let label = new Gtk.Label label: "Hello World"

// Set the window title
mwindow.title := "Hello World!"
mwindow.connect "destroy", #-> Gtk.main_quit()

// Add the label
mwindow.add label
 
// Show the widgets
label.show()
mwindow.show()
 
Gtk.main()
