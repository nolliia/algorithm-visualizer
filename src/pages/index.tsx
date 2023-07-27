import type { NextPage } from 'next'
// import ExplorationModule from "../components/ExplorationModule/ExplorationModule";
import {Box} from "@mui/material";
import dynamic from "next/dynamic";

const ExplorationModule = dynamic(
    () => import('../components/ExplorationModule/ExplorationModule'),
    { ssr: false }
)

const Home: NextPage = () => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: 2
    }}>
      <ExplorationModule />
    </Box>
  )
}

export default Home
