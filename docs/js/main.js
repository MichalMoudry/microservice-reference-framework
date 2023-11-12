window.$docsify = {
    name: 'Microservices Reference Framework',
    repo: 'MichalMoudry/microservices-reference-framework',
    loadSidebar: true,
    subMaxLevel: 2,
    coverpage: true,
    alias: {
        '/.*/_sidebar.md': '/_sidebar.md'
    },
    plugins: [
        function (hook) {
            hook.doneEach(function () {
                let mermaidConfig = {
                    querySelector: ".mermaid",
                };
                mermaid.run(mermaidConfig);
            });
        },
    ]
}