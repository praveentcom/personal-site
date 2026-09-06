import { getCountryFlag } from "@avgeek-inc/ref-data/flags";
export interface CompanyOffice {
  address: string;
  city: string;
  countryCode: string;
  flagSrc?: string;
  countryName: string;
  entityName: string;
  id: string;
  region: string;
}

export const avgeekUsEntity = {
  name: "Avgeek, Inc.",
  address: "4444 2nd Ave, STE 35669, Detroit, MI 48201",
} as const;

export const avgeekIndiaEntity = {
  name: "Avgeek Software LLP",
  address: "2/2 Prime Avenue, Coimbatore, TN 641030",
} as const;

export const avgeekEntityRelationship = `${avgeekIndiaEntity.name} is the Indian subsidiary of ${avgeekUsEntity.name.replace(/\.$/, "")}`;

export const avgeekLegalEntityContactItems = [
  {
    countryCode: "US",
    flagSrc: getCountryFlag("US").src,
    countryName: "United States",
    key: "us-entity",
    value: avgeekUsEntity.name,
  },
  {
    key: "us-address",
    value: avgeekUsEntity.address,
  },
  {
    countryCode: "IN",
    flagSrc: getCountryFlag("IN").src,
    countryName: "India",
    key: "in-entity",
    value: avgeekIndiaEntity.name,
  },
  {
    key: "in-address",
    value: avgeekIndiaEntity.address,
  },
] as const;

export const avgeekOfficeAddresses = [
  {
    address: avgeekUsEntity.address,
    city: "Detroit",
    countryCode: "US",
    flagSrc: getCountryFlag("US").src,
    countryName: "United States",
    entityName: avgeekUsEntity.name,
    id: "detroit",
    region: "MI",
  },
  {
    address: avgeekIndiaEntity.address,
    city: "Coimbatore",
    countryCode: "IN",
    flagSrc: getCountryFlag("IN").src,
    countryName: "India",
    entityName: avgeekIndiaEntity.name,
    id: "coimbatore",
    region: "TN",
  },
] as const satisfies readonly CompanyOffice[];
