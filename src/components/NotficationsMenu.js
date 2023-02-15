import React from 'react'
import { Bell } from 'react-bootstrap-icons'

import styles from '../styles/NotificationsMenu.module.css';

function NotficationsMenu() {
  return (
    <div className="inline-block mx-2">
      <div className="dropdown dropdown-end">
        <label tabindex ="0" className="btn btn-sm btn-ghost">
          <Bell size="16" />
        </ label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li>Notification 1</li>
          <li>Notification 2</li>
        </ul>
      </div>
    </div>
  )
}

export default NotficationsMenu