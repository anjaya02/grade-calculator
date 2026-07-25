export function getClassificationBand(
  average: number,
  hasModulesBelowPassMark = false,
) {
  if (hasModulesBelowPassMark || average < 40) {
    return {
      label: "No Honours Classification",
      background: "bg-red-100",
      color: "text-red-800",
    };
  }

  if (average >= 70) {
    return {
      label: "First Class",
      background: "bg-green-100",
      color: "text-green-800",
    };
  }

  if (average >= 60) {
    return {
      label: "Second Upper",
      background: "bg-blue-100",
      color: "text-blue-800",
    };
  }

  if (average >= 50) {
    return {
      label: "Second Lower",
      background: "bg-orange-100",
      color: "text-orange-800",
    };
  }

  return {
    label: "Third Class",
    background: "bg-purple-100",
    color: "text-purple-800",
  };
}

export function describeOptionalCount(count: number) {
  if (count === 1) return "one optional";
  if (count === 2) return "two optionals";
  return `${count} optionals`;
}
