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
                document: props.document,
                baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`
            });

            // get all the pages
            const pageCount = 0;//await instance.getPageCount();

            // get the text from the pdf
            let text: string = '';
            for (let i = 0; i < pageCount; i++) {
                let lines = await instance.textLinesForPageIndex(i);
                lines.forEach((textLine: any, textLineIndex: number) => {
                    text = text + textLine.contents;
                });
            }

            // call the algorithm by passing the text  



            // Pass the algorithm results to pdf search




            //A sample how we can highlight the resulted key words in the 
            // Instead of props.searchKey we can send the algorithm results

            const results = await instance.search(props.searchKey);

            // Annotate the search  results to highlight them
            const annotations = results.map((result: any) => {
                return new PSPDFKit.Annotations.HighlightAnnotation({
                    pageIndex: result.pageIndex,
                    rects: result.rectsOnPage,
                    boundingBox: PSPDFKit.Geometry.Rect.union(result.rectsOnPage)
                });
            });

            instance.create(annotations);
        })();

        return () => PSPDFKit && PSPDFKit.unload(container)
    }, []);


    return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
}