 requirejs.config({
    baseUrl: "libs/editor.md/lib/",
    paths: {
        marked          : "marked.min",
        prettify        : "prettify.min",
        raphael         : "raphael.min",
        underscore      : "underscore.min",
        flowchart       : "flowchart.min", 
        jqueryflowchart : "jquery.flowchart.min", 
        sequenceDiagram : "sequence-diagram.min",
        katex           : "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min",
        editormd        : "../editormd.amd.min" // Using Editor.md amd version for Require.js
    },
    waitSeconds: 30
});