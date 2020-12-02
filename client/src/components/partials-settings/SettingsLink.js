import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import '../../stylesheets/partials/settingslink.scss'
function SettingsLink({ label, to, active}) {
  let match = useRouteMatch({
    path: to,
    exact: active
  })
  
  return (
    <li className={match ? "active": ""}>
      <Link to={to}>{label}</Link>
    </li>
  )
}

export default SettingsLink