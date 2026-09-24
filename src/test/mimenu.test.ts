import { describe, it, expect } from 'vitest';
import { 
  DEFAULT_VENUE, 
  INITIAL_CATEGORIES, 
  INITIAL_CYCLING_OFFERS, 
  INITIAL_TABLES, 
  calculateHotnessScore, 
  getHotnessLabel 
} from '@/data/mimenuData';

describe('MIMENU - Moe\'s Taberna Santa Cruz de la Sierra Test Suite', () => {

  describe('Venue Configuration', () => {
    it('should be configured for Moe\'s Taberna in Santa Cruz de la Sierra', () => {
      expect(DEFAULT_VENUE.slug).toBe('moes');
      expect(DEFAULT_VENUE.name).toBe("Moe's Taberna");
      expect(DEFAULT_VENUE.city).toBe('Santa Cruz de la Sierra');
      expect(DEFAULT_VENUE.currency).toBe('Bs.');
      expect(DEFAULT_VENUE.currency_code).toBe('BOB');
    });

    it('should contain the primary menu categories (Salchipapas, Nachos, Cervezas, Tragos, Merch)', () => {
      const keys = INITIAL_CATEGORIES.map(c => c.key);
      expect(keys).toContain('salchipapas');
      expect(keys).toContain('nachos');
      expect(keys).toContain('cervezas');
      expect(keys).toContain('tragos');
      expect(keys).toContain('merch');
    });
  });

  describe('6.1 Hotness Algorithm', () => {
    it('should return 5 (On Fire 🔥🔥🔥) when velocity/baseline ratio >= 3.5 or velocity >= 40', () => {
      // 38 orders with 9.2 baseline = ratio 4.13 -> Score 5
      expect(calculateHotnessScore(38, 9.2)).toBe(5);
      expect(calculateHotnessScore(42, 10.1)).toBe(5);
      expect(calculateHotnessScore(50, 20)).toBe(5);
    });

    it('should return 4 (Muy Caliente 🔥) when velocity/baseline ratio >= 2.5 or velocity >= 25', () => {
      // 29 orders with 8.5 baseline = ratio 3.41 -> Score 4
      expect(calculateHotnessScore(24, 8.0)).toBe(4);
    });

    it('should return 3 (Popular ⚡) when velocity/baseline ratio >= 1.5', () => {
      expect(calculateHotnessScore(15, 8.0)).toBe(3);
    });

    it('should return 2 (Templado 🌡️) when velocity/baseline ratio >= 0.8', () => {
      expect(calculateHotnessScore(7, 8.0)).toBe(2);
    });

    it('should return 1 (Frío ❄️) for low velocity', () => {
      expect(calculateHotnessScore(1, 10.0)).toBe(1);
    });

    it('should generate correct visual metadata from score', () => {
      const hotLabel = getHotnessLabel(5);
      expect(hotLabel.label).toBe('¡En Llamas!');
      expect(hotLabel.flameCount).toBe(3);

      const warmLabel = getHotnessLabel(2);
      expect(warmLabel.label).toBe('Templado');
    });
  });

  describe('5.1 Intelligent Cycling Offers', () => {
    it('should contain pre-configured offers for Happy Hour and Late Night', () => {
      expect(INITIAL_CYCLING_OFFERS.length).toBeGreaterThanOrEqual(3);
      
      const happyHour = INITIAL_CYCLING_OFFERS.find(o => o.id === 'offer-happy-hour-fernet');
      expect(happyHour).toBeDefined();
      expect(happyHour?.discount_price).toBe(35);
      expect(happyHour?.original_price).toBe(70);

      const lateNight = INITIAL_CYCLING_OFFERS.find(o => o.id === 'offer-late-night-combo');
      expect(lateNight).toBeDefined();
      expect(lateNight?.discount_price).toBe(85);
    });
  });

  describe('6.3 Physical Table & QR Mapping', () => {
    it('should have tables configured with unique hashes', () => {
      expect(INITIAL_TABLES.length).toBeGreaterThanOrEqual(10);
      const hashes = INITIAL_TABLES.map(t => t.qr_code_hash);
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(hashes.length);
    });
  });
});
