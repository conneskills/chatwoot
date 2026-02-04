import {
  generateReportURLParams,
  parseReportURLParams,
} from './reportFilterHelper';

describe('reportFilterHelper', () => {
  describe('generateReportURLParams', () => {
    it('generates URL params with from and to dates', () => {
      const params = generateReportURLParams({
        from: 1738607400,
        to: 1770229799,
      });

      expect(params).toEqual({
        from: 1738607400,
        to: 1770229799,
      });
    });

    it('includes business hours when true', () => {
      const params = generateReportURLParams({
        from: 1738607400,
        to: 1770229799,
        businessHours: true,
      });

      expect(params).toEqual({
        from: 1738607400,
        to: 1770229799,
        business_hours: 'true',
      });
    });

    it('excludes business hours when false', () => {
      const params = generateReportURLParams({
        from: 1738607400,
        to: 1770229799,
        businessHours: false,
      });

      expect(params).toEqual({
        from: 1738607400,
        to: 1770229799,
      });
    });

    it('includes group by parameter', () => {
      const params = generateReportURLParams({
        from: 1738607400,
        to: 1770229799,
        groupBy: 3,
      });

      expect(params).toEqual({
        from: 1738607400,
        to: 1770229799,
        group_by: 3,
      });
    });

    it('includes range type', () => {
      const params = generateReportURLParams({
        from: 1738607400,
        to: 1770229799,
        range: 'last7days',
      });

      expect(params).toEqual({
        from: 1738607400,
        to: 1770229799,
        range: 'last7days',
      });
    });

    it('generates complete URL params with all options', () => {
      const params = generateReportURLParams({
        from: 1738607400,
        to: 1770229799,
        businessHours: true,
        groupBy: 3,
        range: 'lastYear',
      });

      expect(params).toEqual({
        from: 1738607400,
        to: 1770229799,
        business_hours: 'true',
        group_by: 3,
        range: 'lastYear',
      });
    });
  });

  describe('parseReportURLParams', () => {
    it('parses from and to dates as numbers', () => {
      const result = parseReportURLParams({
        from: '1738607400',
        to: '1770229799',
      });

      expect(result).toEqual({
        from: 1738607400,
        to: 1770229799,
        businessHours: false,
        groupBy: null,
        range: null,
      });
    });

    it('parses business hours as boolean', () => {
      const result = parseReportURLParams({
        from: '1738607400',
        to: '1770229799',
        business_hours: 'true',
      });

      expect(result.businessHours).toBe(true);
    });

    it('returns false for business hours when not "true"', () => {
      const result = parseReportURLParams({
        from: '1738607400',
        to: '1770229799',
        business_hours: 'false',
      });

      expect(result.businessHours).toBe(false);
    });

    it('parses group by as number', () => {
      const result = parseReportURLParams({
        from: '1738607400',
        to: '1770229799',
        group_by: '3',
      });

      expect(result.groupBy).toBe(3);
    });

    it('parses range type', () => {
      const result = parseReportURLParams({
        from: '1738607400',
        to: '1770229799',
        range: 'last7days',
      });

      expect(result.range).toBe('last7days');
    });

    it('returns null for missing parameters', () => {
      const result = parseReportURLParams({});

      expect(result).toEqual({
        from: null,
        to: null,
        businessHours: false,
        groupBy: null,
        range: null,
      });
    });

    it('parses complete URL params with all options', () => {
      const result = parseReportURLParams({
        from: '1738607400',
        to: '1770229799',
        business_hours: 'true',
        group_by: '3',
        range: 'lastYear',
      });

      expect(result).toEqual({
        from: 1738607400,
        to: 1770229799,
        businessHours: true,
        groupBy: 3,
        range: 'lastYear',
      });
    });

    it('handles numeric values correctly', () => {
      const result = parseReportURLParams({
        from: 1738607400,
        to: 1770229799,
        group_by: 3,
      });

      expect(result.from).toBe(1738607400);
      expect(result.to).toBe(1770229799);
      expect(result.groupBy).toBe(3);
    });
  });

  describe('round-trip conversion', () => {
    it('maintains data integrity through generate and parse cycle', () => {
      const original = {
        from: 1738607400,
        to: 1770229799,
        businessHours: true,
        groupBy: 3,
        range: 'lastYear',
      };

      const urlParams = generateReportURLParams(original);
      const parsed = parseReportURLParams(urlParams);

      expect(parsed.from).toBe(original.from);
      expect(parsed.to).toBe(original.to);
      expect(parsed.businessHours).toBe(original.businessHours);
      expect(parsed.groupBy).toBe(original.groupBy);
      expect(parsed.range).toBe(original.range);
    });
  });
});
