import './App.css';
import DynamicTable from './components/DynamicTable';

function App() {
  const initData = {
    columns: [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'name', headerName: 'Name', width: 150 },
      { field: 'weight', headerName: 'Weight (kg)', width: 150 },
      { field: 'height', headerName: 'Height (cm)', width: 150 },
    ],
    rows: [
      { id: 1, name: 'Alice', weight: 60, height: 165 },
      { id: 2, name: 'Bob', weight: 75, height: 180 },
      { id: 3, name: 'Charlie', weight: 68, height: 175 },
    ],
  };
  const openaiEngine = 'text-davinci-003'
  const apiKey = 'your_open_ai_api_key'
  return (
    <div className="App">
      <DynamicTable
        openaiEngine={openaiEngine}
        apiKey={apiKey}
        initData={initData} />
    </div>
  );
}

export default App;
