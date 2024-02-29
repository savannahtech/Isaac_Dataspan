import React from 'react'
import styled from 'styled-components'
import LeftNavigation from '../components/Dashboard/LeftNavigation.component'
import Workspace from '../components/Dashboard/Workspace.component'

const Dashboard = () => {
  return (
    <Container>
      <LeftNavigation/>
      <Workspace />
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: row;
  gap: 20px;
`

export default Dashboard