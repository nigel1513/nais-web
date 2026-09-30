"use client";
import { Component, type ReactNode } from "react";

/** 3D 렌더러 생성 실패(컨텍스트 한도, GPU 프로세스 오류 등)가 페이지 전체를 무너뜨리지 않게 막는다. */
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { document.documentElement.dataset.webgl = "off"; }
  render() { return this.state.failed ? null : this.props.children; }
}
