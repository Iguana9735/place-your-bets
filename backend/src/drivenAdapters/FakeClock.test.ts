import { describe, expect, it } from '@jest/globals'
import FakeClock from './FakeClock'

describe('FakeClock', () => {
    it('can be set to any time', () => {
        const clock = new FakeClock()

        clock.setTime(new Date('2020-01-01T00:00:00Z'))
        expect(clock.getTime()).toEqual(new Date('2020-01-01T00:00:00Z'))

        clock.setTime(new Date('2030-01-01T00:00:00Z'))
        expect(clock.getTime()).toEqual(new Date('2030-01-01T00:00:00Z'))
    })

    it('can advance a given number of seconds', () => {
        // Given
        const clock = new FakeClock()
        clock.setTime(new Date('2020-01-01T00:00:00Z'))

        // When
        clock.advanceSeconds(123)

        // Then
        expect(clock.getTime()).toEqual(new Date('2020-01-01T00:02:03Z'))
    })
})
