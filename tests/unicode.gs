test "Unicode identifiers", #
  let µ = "mu"
  eq "mu", µ

test "Unicode properties", #
  let x = { µ: "mu" }
  eq "mu", x.µ