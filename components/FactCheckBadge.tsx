interface FactCheckBadgeProps {
    factCheck: { isVerified: boolean; details: string };
  }
  
  export default function FactCheckBadge({ factCheck }: FactCheckBadgeProps) {
    return (
      <span
        className={`text-sm px-2 py-1 rounded ${
          factCheck.isVerified
            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
        }`}
        title={factCheck.details}
      >
        {factCheck.isVerified ? "Verified" : "Unverified"}
      </span>
    );
  }