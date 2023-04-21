export interface IPrinter {
    print(content: string): Promise<void>;
}

export class Printer implements IPrinter {
    async print(content: string): Promise<void> {
        const printWindow = window.open('', 'PRINT', 'width=800,height=600,toolbar=0,scrollbars=0,status=0') as Window;
        
        let isPrinted = false;
        function printFn() {
            if(isPrinted) return;
            isPrinted = true;
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }

        printWindow.document.write(content);
        printWindow.document.close();
        setTimeout(printFn, 500); // leave some time to load stylesheets
    }

}