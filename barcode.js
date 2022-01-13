import { useBarcode } from '@createnextapp/react-barcode';

function barcode() {
  const { inputRef } = useBarcode({
    value: 'barcode',
    options: {
      background: '',
    }
  });
  return (
    <div className="App">
          <svg ref={inputRef}></svg>
    </div>
  );
}

export default barcode;
