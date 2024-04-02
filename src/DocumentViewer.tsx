import { useEffect, useRef } from "react";


export default function DocumentViewerComponent(props: any) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        let PSPDFKit: any, instance;

        (async function () {
            PSPDFKit = await import("pspdfkit")
            PSPDFKit.unload(container)
            instance = await PSPDFKit.load({
                container,
                licenseKey: 'MtJxZT-6BeCwvlrBykO1mHNd7u7X5drE-F4KWaPu5DLz0NjxySqP7fFnT77X7wibZbFweflPQGgzB1kbU-e0ADVKRrL-maEAch0dIlx5ufN_dhZHRQ2xoJfYuizYC3eJb7oVefIUwnxFdY51cDRAo6j5295zs2w7amRYitRcZlgehrlkHcYybmtdiiiMB3aEFH5glz7nW3PiiTjX',
                document: props.document,
                baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`
            });

            // get all the pages
            const pageCount = 0;//await instance.getPageCount();

            // get the entire text from the pdf
            let text: string = '';
            for (let i = 0; i < pageCount; i++) {
                let lines = await instance.textLinesForPageIndex(i);
                lines.forEach((textLine: any, textLineIndex: number) => {
                    text = text + textLine.contents;
                });
            }

            // call the algorithm by passing the text of pdf



            // Pass the algorithm results to pdf search




            //A sample how we can highlight the resulted key words in the 
            // Instead of props.searchKey we can send the algorithm results
            if (props.searchKey) {
                const results = await instance.search(props.searchKey);

                // Annotate the search  results to highlight them
                if (results) {
                    const annotations = results.map((result: any) => {
                        return new PSPDFKit.Annotations.HighlightAnnotation({
                            pageIndex: result.pageIndex,
                            rects: result.rectsOnPage,
                            boundingBox: PSPDFKit.Geometry.Rect.union(result.rectsOnPage)
                        });
                    });

                    instance.create(annotations);
                }

            }

        })();

        return () => PSPDFKit && PSPDFKit.unload(container)
    }, [props.searchKey]);


    return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
}