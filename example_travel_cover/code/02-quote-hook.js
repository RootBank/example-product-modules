/**
 * Validate the quote request data before passing it to the `getQuote` function.
 * https://docs.rootplatform.com/docs/quote-hook#validating-the-quote-parameters
 */
const validateQuoteRequest = (data) => {
  const result = Joi.validate(
    data,
    Joi.object()
      .keys({
        // Trip details
        trip: Joi.string()
          .valid(["single_trip", "multi_trip", "long_stay"])
          .required(),
        destination: Joi.string()
          .valid([
            "uk",
            "europe",
            "australia_new_zealand",
            "world_wide",
            "world_wide_incl_usa_canada",
          ])
          .required(),
        single_trip_extras: Joi.object()
          .keys({
            wintersports: Joi.boolean().required(),
            wedding: Joi.boolean().required(),
            gadget_business: Joi.boolean().required(),
            cruise: Joi.boolean().required(),
            golf: Joi.boolean().required(),
            excess_waiver: Joi.boolean().required(),
            trip_disruption: Joi.boolean().required(),
            extra_week: Joi.boolean().required(),
          })
          .when("trip", { is: "single_trip", then: Joi.required() }),
        multi_trip_extras: Joi.object()
          .keys({
            wintersports: Joi.boolean().required(),
            wedding: Joi.boolean().required(),
            gadget_business: Joi.boolean().required(),
            cruise: Joi.boolean().required(),
            golf: Joi.boolean().required(),
            excess_waiver: Joi.boolean().required(),
            trip_disruption: Joi.boolean().required(),
          })
          .when("trip", { is: "multi_trip", then: Joi.required() }),
        long_stay_extras: Joi.object()
          .keys({
            wintersports: Joi.boolean().required(),
            exam_failure: Joi.boolean().required(),
            excess_waiver: Joi.boolean().required(),
            trip_disruption: Joi.boolean().required(),
          })
          .when("trip", { is: "long_stay", then: Joi.required() }),
        trip_start_date: Joi.date()
          .iso()
          .min(moment().startOf("day").subtract(1, "days").toDate()) // Subtracting a day because of weird timezone funnies
          .required(),
        trip_end_date: Joi.date()
          .iso()
          .min(moment().startOf("day").subtract(1, "days").toDate()) // Subtracting a day because of weird timezone funnies
          .max(moment().endOf("day").add(31, "days").toDate())
          .when("trip", { is: "single_trip", then: Joi.required() }),
        long_stay_duration_days: Joi.string()
          .valid([
            "31_days",
            "60_days",
            "90_days",
            "120_days",
            "150_days",
            "180_days",
            "270_days",
            "365_days",
            "730_days",
          ])
          .when("trip", { is: "long_stay", then: Joi.required() }),

        // Covered persons
        cover_type: Joi.string()
          .valid(["adult", "couple", "family"])
          .when("trip", { is: Joi.not("long_stay"), then: Joi.required(), otherwise: Joi.optional() }),
        persons: Joi.array()
          .items(
            Joi.object()
              .keys({
                age: Joi.number().integer().min(18).max(85).required(),
              })
              .required()
          )
          .required(),
      })
      .required(),
    { abortEarly: false }
  );
  return result;
};

/**
 * Generate an array of Quote Packages from the quote request data.
 * https://docs.rootplatform.com/docs/quote-hook#generating-a-quote-package
 */
const getQuote = (data) => {

  // Single Trip
  if (data.trip === "single_trip")
    return getQuoteForSingleTrip(data);

  // Multi Trip
  if (data.trip === "multi_trip")
    return getQuoteForMultiTrip(data);

  // Long-stay Trip
  if (data.trip === "long_stay")
    return new Error('Long-stay not yet implemented');

};
