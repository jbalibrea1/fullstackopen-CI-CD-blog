import React from 'react'
import { connect } from 'react-redux'
import { Alert } from './Alert'

const Notification = (props) => {
  const { msg, type } = props.notification

  if (!type) {
    return null
  }

  return <Alert type={type} id="notification">{msg}</Alert>
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  }
}

export default connect(mapStateToProps)(Notification)
