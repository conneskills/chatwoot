export const generateReportURLParams = ({
  from,
  to,
  businessHours,
  groupBy,
  range,
}) => {
  const params = {};

  // Always include from/to dates
  if (from) params.from = from;
  if (to) params.to = to;

  if (businessHours) params.business_hours = 'true';
  if (groupBy) params.group_by = groupBy;

  // Include range type (last7days, last3months, custom, etc.)
  if (range) params.range = range;

  return params;
};

export const parseReportURLParams = query => {
  const { from, to, business_hours, group_by, range } = query;

  return {
    from: from ? Number(from) : null,
    to: to ? Number(to) : null,
    businessHours: business_hours === 'true',
    groupBy: group_by ? Number(group_by) : null,
    range: range || null,
  };
};
