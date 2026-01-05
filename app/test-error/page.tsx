"use client";

export default function TestErrorPage() {
  throw new TypeError("Cannot read properties of undefined (reading 'not')");
}
