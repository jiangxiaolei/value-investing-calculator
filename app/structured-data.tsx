import { getWebsiteSchema, getOrganizationSchema } from "@/lib/structured-data"

export function StructuredData() {
  const schemas = [getWebsiteSchema(), getOrganizationSchema()]
  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  )
}
