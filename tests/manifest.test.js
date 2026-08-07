import { readFile } from 'fs/promises'
import { describe, it, expect } from 'vitest'

describe('Web manifest', async () => {
  const raw = await readFile(new URL('../public/manifest.json', import.meta.url), 'utf-8')
  const manifest = JSON.parse(raw)

  it('has a non-empty name and short_name', () => {
    expect(manifest.name).toBeTruthy()
    expect(manifest.short_name).toBeTruthy()
  })

  it('contains at least one icon', () => {
    expect(Array.isArray(manifest.icons)).toBe(true)
    expect(manifest.icons.length).toBeGreaterThan(0)
  })
})
