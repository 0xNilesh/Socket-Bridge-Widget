import { useGetSupportedChainsQuery } from "./services/socket";

const App = () => {
  const { data, error, isLoading } = useGetSupportedChainsQuery();

  return (<div>
    {isLoading && (<>Loading...</>)}
    {error && (<>Error...</>)}
    {data ? <>
      <div>data fetched successfully</div>
      {console.log(data?.result)}
    </> : <>no data</>}
  </div>);
}

export default App;