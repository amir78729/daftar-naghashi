import DaftarNaghashi from "./components/DaftarNaghashi";

function App() {

  return (
        <DaftarNaghashi
            height={300}
            width={250}
            onDrawing={(canvas) => console.log(canvas?.toDataURL())}
        />
  )
}

export default App
