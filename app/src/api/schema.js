import { schema } from "normalizr";

export const user = new schema.Entity("users");

export const government = new schema.Entity("governments");

export const campaign = new schema.Entity("campaigns");

export const permission = new schema.Entity("permissions", {
  user,
  government,
  campaign
});

export const activity = new schema.Entity("activities");

export const contribution = new schema.Entity("contributions");
