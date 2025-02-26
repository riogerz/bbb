import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util"
import { Blob, File } from "buffer"

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.Blob = Blob
global.File = File

// Mock de fetch para pruebas
global.fetch = jest.fn()

