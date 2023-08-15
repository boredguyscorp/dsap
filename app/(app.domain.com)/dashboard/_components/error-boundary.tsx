'use client'

import { Component } from 'react'

class ErrorBoundary<
  Props extends {
    fallback: React.ReactNode
    children: React.ReactNode
  }
> extends Component<Props> {
  state = { hasError: false }

  constructor(props: Props) {
    super(props)
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback
    }

    return this.props.children
  }
}

export default ErrorBoundary
