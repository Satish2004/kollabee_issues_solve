const BANKS: Record<string, { name: string; value: string }[]> = {
    india: [
      // Public Sector Banks
      { name: "State Bank of India", value: "STATE_BANK_OF_INDIA" },
      { name: "Bank of India", value: "BANK_OF_INDIA" },
      { name: "Bank of Baroda", value: "BANK_OF_BARODA" },
      { name: "Canara Bank", value: "CANARA_BANK" },
      { name: "Punjab National Bank", value: "PUNJAB_NATIONAL_BANK" },
      { name: "Central Bank of India", value: "CENTRAL_BANK_OF_INDIA" },
      { name: "Indian Bank", value: "INDIAN_BANK" },
      { name: "Indian Overseas Bank", value: "INDIAN_OVERSEAS_BANK" },
      { name: "Punjab & Sind Bank", value: "PUNJAB_SIND_BANK" },
      { name: "UCO Bank", value: "UCO_BANK" },
      { name: "Union Bank of India", value: "UNION_BANK_OF_INDIA" },
      // Private Sector Banks
      { name: "Axis Bank Ltd.", value: "AXIS_BANK" },
      { name: "Bandhan Bank Ltd.", value: "BANDHAN_BANK" },
      { name: "CSB Bank Ltd.", value: "CSB_BANK" },
      { name: "City Union Bank Ltd.", value: "CITY_UNION_BANK" },
      { name: "DCB Bank Ltd.", value: "DCB_BANK" },
      { name: "Dhanlaxmi Bank Ltd.", value: "DHANLAXMI_BANK" },
      { name: "Federal Bank Ltd.", value: "FEDERAL_BANK" },
      { name: "HDFC Bank Ltd.", value: "HDFC_BANK" },
      { name: "ICICI Bank Ltd.", value: "ICICI_BANK" },
      { name: "IndusInd Bank Ltd.", value: "INDUSIND_BANK" },
      { name: "IDFC First Bank Ltd.", value: "IDFC_FIRST_BANK" },
      { name: "IDBI Bank Ltd.", value: "IDBI_BANK" },
      { name: "Jammu & Kashmir Bank Ltd.", value: "JAMMU_KASHMIR_BANK" },
      { name: "Karnataka Bank Ltd.", value: "KARNATAKA_BANK" },
      { name: "Karur Vysya Bank Ltd.", value: "KARUR_VYSYA_BANK" },
      { name: "Kotak Mahindra Bank Ltd.", value: "KOTAK_MAHINDRA_BANK" },
      { name: "Lakshmi Vilas Bank Ltd.", value: "LAKSHMI_VILAS_BANK" },
      { name: "Nainital Bank Ltd.", value: "NAINITAL_BANK" },
      { name: "RBL Bank Ltd.", value: "RBL_BANK" },
      { name: "South Indian Bank Ltd.", value: "SOUTH_INDIAN_BANK" },
      {
        name: "Tamilnad Mercantile Bank Ltd.",
        value: "TAMILNAD_MERCANTILE_BANK",
      },
      { name: "YES Bank Ltd.", value: "YES_BANK" },
      // Foreign Banks (sample)
      { name: "HSBC Ltd.", value: "HSBC" },
      { name: "Standard Chartered Bank", value: "STANDARD_CHARTERED" },
      { name: "Citibank N.A.", value: "CITIBANK_NA" },
      { name: "Deutsche Bank", value: "DEUTSCHE_BANK" },
      { name: "Barclays Bank Plc.", value: "BARCLAYS" },
      // Small Finance Banks (sample)
      { name: "Au Small Finance Bank Ltd.", value: "AU_SMALL_FINANCE_BANK" },
      {
        name: "Equitas Small Finance Bank Ltd.",
        value: "EQUITAS_SMALL_FINANCE_BANK",
      },
      {
        name: "Ujjivan Small Finance Bank Ltd.",
        value: "UJJIVAN_SMALL_FINANCE_BANK",
      },
      // Payment Banks (sample)
      {
        name: "India Post Payments Bank Ltd.",
        value: "INDIA_POST_PAYMENTS_BANK",
      },
      { name: "Paytm Payments Bank Ltd.", value: "PAYTM_PAYMENTS_BANK" },
      { name: "Airtel Payments Bank Ltd.", value: "AIRTEL_PAYMENTS_BANK" },
      // Regional Rural Banks (sample)
      { name: "Andhra Pradesh Grameena Bank", value: "AP_GRAMEENA_BANK" },
      { name: "Kerala Gramin Bank", value: "KERALA_GRAMIN_BANK" },
      // Local Area Banks (sample)
      { name: "Coastal Local Area Bank Ltd", value: "COASTAL_LAB" },
      // ...add more as needed, following the same format
    ],
    us: [
      {
        name: "ADP Trust Company",
        value: "adp_trust_company",
      },
      {
        name: "Academy Bank",
        value: "academy_bank",
      },
      {
        name: "Affinity Bank",
        value: "affinity_bank",
      },
      {
        name: "Agility Bank",
        value: "agility_bank",
      },
      {
        name: "Alerus Financial",
        value: "alerus_financial",
      },
      {
        name: "Amerant Bank",
        value: "amerant_bank",
      },
      {
        name: "American Bank",
        value: "american_bank",
      },
      {
        name: "American Bank and Trust Company",
        value: "american_bank_and_trust_company",
      },
      {
        name: "American Commerc e Bank",
        value: "american_commerc_e_bank",
      },
      {
        name: "American Commerc ial Bank & Trust",
        value: "american_commerc_ial_bank_&_trust",
      },
      {
        name: "American Plus Bank",
        value: "american_plus_bank",
      },
      {
        name: "Associated Bank",
        value: "associated_bank",
      },
      {
        name: "Associated Trust Company",
        value: "associated_trust_company",
      },
      {
        name: "Axiom Bank",
        value: "axiom_bank",
      },
      {
        name: "BNY Mellon",
        value: "bny_mellon",
      },
      {
        name: "BOKF",
        value: "bokf",
      },
      {
        name: "BancCentral",
        value: "banccentral",
      },
      {
        name: "Bank First",
        value: "bank_first",
      },
      {
        name: "Bank of Americ a",
        value: "bank_of_americ_a",
      },
      {
        name: "Bank of Americ a California",
        value: "bank_of_americ_a_california",
      },
      {
        name: "Bank of Brenham",
        value: "bank_of_brenham",
      },
      {
        name: "Bank of Bridger",
        value: "bank_of_bridger",
      },
      {
        name: "Bank of Brookfield-Purdin",
        value: "bank_of_brookfield-purdin",
      },
      {
        name: "Bank of Hillsboro",
        value: "bank_of_hillsboro",
      },
      {
        name: "Bank of Whittier",
        value: "bank_of_whittier",
      },
      {
        name: "BankChampaign",
        value: "bankchampaign",
      },
      {
        name: "BankFinancial",
        value: "bankfinancial",
      },
      {
        name: "BankUnited",
        value: "bankunited",
      },
      {
        name: "Beacon Business Bank",
        value: "beacon_business_bank",
      },
      {
        name: "Bessemer Trust Company",
        value: "bessemer_trust_company",
      },
      {
        name: "Bessemer Trust Company of California",
        value: "bessemer_trust_company_of_california",
      },
      {
        name: "Beverly Bank & Trust Company",
        value: "beverly_bank_&_trust_company",
      },
      {
        name: "Big Bend Banks",
        value: "big_bend_banks",
      },
      {
        name: "Black Hills Community Bank",
        value: "black_hills_community_bank",
      },
      {
        name: "BlackRock Institutional Trust Company",
        value: "blackrock_institutional_trust_company",
      },
      {
        name: "Blue Ridge Bank",
        value: "blue_ridge_bank",
      },
      {
        name: "Bonvenu Bank",
        value: "bonvenu_bank",
      },
      {
        name: "C3bank",
        value: "c3bank",
      },
      {
        name: "CFBank",
        value: "cfbank",
      },
      {
        name: "CNB Bank & Trust",
        value: "cnb_bank_&_trust",
      },
      {
        name: "California Bank of Commerce",
        value: "california_bank_of_commerce",
      },
      {
        name: "Capital Bank",
        value: "capital_bank",
      },
      {
        name: "Capital One",
        value: "capital_one",
      },
      {
        name: "Carthage Savings  and Loan",
        value: "carthage_savings__and_loan",
      },
      {
        name: "Cendera Bank",
        value: "cendera_bank",
      },
      {
        name: "Cetera Trust Company",
        value: "cetera_trust_company",
      },
      {
        name: "Chain Bridge Bank",
        value: "chain_bridge_bank",
      },
      {
        name: "Chilton Trust Company",
        value: "chilton_trust_company",
      },
      {
        name: "Chino Commercial Bank",
        value: "chino_commercial_bank",
      },
      {
        name: "Citibank",
        value: "citibank",
      },
      {
        name: "Citicorp Trust Delaware",
        value: "citicorp_trust_delaware",
      },
      {
        name: "City First Bank",
        value: "city_first_bank",
      },
      {
        name: "Clare Bank",
        value: "clare_bank",
      },
      {
        name: "Comerica Bank & Trust",
        value: "comerica_bank_&_trust",
      },
      {
        name: "Community Bank",
        value: "community_bank",
      },
      {
        name: "Computershare Trus t Company",
        value: "computershare_trus_t_company",
      },
      {
        name: "Connecticut Community Bank",
        value: "connecticut_community_bank",
      },
      {
        name: "Credit One Bank",
        value: "credit_one_bank",
      },
      {
        name: "Dakota Community Bank & Trust",
        value: "dakota_community_bank_&_trust",
      },
      {
        name: "Dallas Capital Bank",
        value: "dallas_capital_bank",
      },
      {
        name: "Desjardins Bank",
        value: "desjardins_bank",
      },
      {
        name: "Deutsche Bank Trus t Company",
        value: "deutsche_bank_trus_t_company",
      },
      {
        name: "Dream First Bank",
        value: "dream_first_bank",
      },
      {
        name: "Eastbank",
        value: "eastbank",
      },
      {
        name: "Elevate Bank",
        value: "elevate_bank",
      },
      {
        name: "Esquire Bank",
        value: "esquire_bank",
      },
      {
        name: "EverBank",
        value: "everbank",
      },
      {
        name: "Evercore Trust Company",
        value: "evercore_trust_company",
      },
      {
        name: "Extraco Banks",
        value: "extraco_banks",
      },
      {
        name: "F&M Community Bank",
        value: "f&m_community_bank",
      },
      {
        name: "FCN Bank",
        value: "fcn_bank",
      },
      {
        name: "FSNB",
        value: "fsnb",
      },
      {
        name: "Fidelity Bank",
        value: "fidelity_bank",
      },
      {
        name: "Fifth Third Bank",
        value: "fifth_third_bank",
      },
      {
        name: "First Bankers Trust Company",
        value: "first_bankers_trust_company",
      },
      {
        name: "First Century Bank",
        value: "first_century_bank",
      },
      {
        name: "First Commercial Bank",
        value: "first_commercial_bank",
      },
      {
        name: "First Community Trust",
        value: "first_community_trust",
      },
      {
        name: "First Federal Community Bank",
        value: "first_federal_community_bank",
      },
      {
        name: "First Financial Trust",
        value: "first_financial_trust",
      },
      {
        name: "First Neighbor Bank",
        value: "first_neighbor_bank",
      },
      {
        name: "First Robinson Savings Bank",
        value: "first_robinson_savings_bank",
      },
      {
        name: "Flagstar Bank",
        value: "flagstar_bank",
      },
      {
        name: "Florida Capital Bank",
        value: "florida_capital_bank",
      },
      {
        name: "Fulton Bank",
        value: "fulton_bank",
      },
      {
        name: "FundBank",
        value: "fundbank",
      },
      {
        name: "GNBank",
        value: "gnbank",
      },
      {
        name: "Golden Bank",
        value: "golden_bank",
      },
      {
        name: "Goldwater Bank",
        value: "goldwater_bank",
      },
      {
        name: "Grasshopper Bank",
        value: "grasshopper_bank",
      },
      {
        name: "Guaranty Bank & Trust",
        value: "guaranty_bank_&_trust",
      },
      {
        name: "HSBC Bank USA",
        value: "hsbc_bank_usa",
      },
      {
        name: "Hana Bank  USA",
        value: "hana_bank__usa",
      },
      {
        name: "Heritage Bank",
        value: "heritage_bank",
      },
      {
        name: "Hightower Trust Company",
        value: "hightower_trust_company",
      },
      {
        name: "Hinsdale Bank & Trust Company",
        value: "hinsdale_bank_&_trust_company",
      },
      {
        name: "Home Bank",
        value: "home_bank",
      },
      {
        name: "Hometown Bank",
        value: "hometown_bank",
      },
      {
        name: "INB",
        value: "inb",
      },
      {
        name: "Incommons Bank",
        value: "incommons_bank",
      },
      {
        name: "Inspire Trust Company",
        value: "inspire_trust_company",
      },
      {
        name: "Intrust Bank",
        value: "intrust_bank",
      },
      {
        name: "Investar Bank",
        value: "investar_bank",
      },
      {
        name: "Keen Bank",
        value: "keen_bank",
      },
      {
        name: "Lake Forest Bank & Trust Company",
        value: "lake_forest_bank_&_trust_company",
      },
      {
        name: "Leader Bank",
        value: "leader_bank",
      },
      {
        name: "Legacy Trust Company",
        value: "legacy_trust_company",
      },
      {
        name: "Legend Bank",
        value: "legend_bank",
      },
      {
        name: "Liberty Bank",
        value: "liberty_bank",
      },
      {
        name: "Libertyville Bank & Trust Company",
        value: "libertyville_bank_&_trust_company",
      },
      {
        name: "Lone Oak Bank",
        value: "lone_oak_bank",
      },
      {
        name: "Lone Star Capital Bank",
        value: "lone_star_capital_bank",
      },
      {
        name: "Merchants  Bank",
        value: "merchants__bank",
      },
      {
        name: "Modern Bank",
        value: "modern_bank",
      },
      {
        name: "Morgan Stanley Bank",
        value: "morgan_stanley_bank",
      },
      {
        name: "Morgan Stanley Private Bank",
        value: "morgan_stanley_private_bank",
      },
      {
        name: "Mountain Valley Bank",
        value: "mountain_valley_bank",
      },
      {
        name: "Natbank",
        value: "natbank",
      },
      {
        name: "National Cooperative Bank",
        value: "national_cooperative_bank",
      },
      {
        name: "Native American Bank",
        value: "native_american_bank",
      },
      {
        name: "New Horizon Bank",
        value: "new_horizon_bank",
      },
      {
        name: "New Omni Bank",
        value: "new_omni_bank",
      },
      {
        name: "Newtek Bank",
        value: "newtek_bank",
      },
      {
        name: "NexTier Bank",
        value: "nextier_bank",
      },
      {
        name: "Northbrook Bank & Trust Company",
        value: "northbrook_bank_&_trust_company",
      },
      {
        name: "Northern Interstate Bank",
        value: "northern_interstate_bank",
      },
      {
        name: "Northwestern Bank",
        value: "northwestern_bank",
      },
      {
        name: "OceanFirst Bank",
        value: "oceanfirst_bank",
      },
      {
        name: "Old Plank Trail Community Bank",
        value: "old_plank_trail_community_bank",
      },
      {
        name: "Old Point Trust & Financial Servic es",
        value: "old_point_trust_&_financial_servic_es",
      },
      {
        name: "PNC Bank",
        value: "pnc_bank",
      },
      {
        name: "Pacific Premier Bank",
        value: "pacific_premier_bank",
      },
      {
        name: "Park Bank",
        value: "park_bank",
      },
      {
        name: "Pathward",
        value: "pathward",
      },
      {
        name: "Patriot Bank",
        value: "patriot_bank",
      },
      {
        name: "Patrons Bank",
        value: "patrons_bank",
      },
      {
        name: "Peoples National Bank",
        value: "peoples_national_bank",
      },
      {
        name: "Pioneer Trust Bank",
        value: "pioneer_trust_bank",
      },
      {
        name: "Plante Moran Trust",
        value: "plante_moran_trust",
      },
      {
        name: "Raymond James Trust",
        value: "raymond_james_trust",
      },
      {
        name: "RockPointBank",
        value: "rockpointbank",
      },
      {
        name: "Rockefeller Trust Company",
        value: "rockefeller_trust_company",
      },
      {
        name: "SNB Bank",
        value: "snb_bank",
      },
      {
        name: "Santander Bank",
        value: "santander_bank",
      },
      {
        name: "Schaumburg Bank & Trust Company",
        value: "schaumburg_bank_&_trust_company",
      },
      {
        name: "Shore United Bank",
        value: "shore_united_bank",
      },
      {
        name: "Signature Bank",
        value: "signature_bank",
      },
      {
        name: "SmartBiz Bank",
        value: "smartbiz_bank",
      },
      {
        name: "SouthState Bank",
        value: "southstate_bank",
      },
      {
        name: "Southtrust Bank",
        value: "southtrust_bank",
      },
      {
        name: "St. Charles Bank & Trus t Company",
        value: "st_charles_bank_&_trus_t_company",
      },
      {
        name: "State Bank of the Lakes",
        value: "state_bank_of_the_lakes",
      },
      {
        name: "Stifel Trust Company",
        value: "stifel_trust_company",
      },
      {
        name: "Stifel Trust Company Delaware",
        value: "stifel_trust_company_delaware",
      },
      {
        name: "Stride Bank",
        value: "stride_bank",
      },
      {
        name: "Sunrise Banks",
        value: "sunrise_banks",
      },
      {
        name: "Synovus Trust Company",
        value: "synovus_trust_company",
      },
      {
        name: "T Bank",
        value: "t_bank",
      },
      {
        name: "TCM Bank",
        value: "tcm_bank",
      },
      {
        name: "TD Bank",
        value: "td_bank",
      },
      {
        name: "TD Bank USA",
        value: "td_bank_usa",
      },
      {
        name: "TIAA Trust",
        value: "tiaa_trust",
      },
      {
        name: "Texana Bank",
        value: "texana_bank",
      },
      {
        name: "Texas Advantage Community Bank",
        value: "texas_advantage_community_bank",
      },
      {
        name: "Texas Gulf Bank",
        value: "texas_gulf_bank",
      },
      {
        name: "Texas Republic Bank",
        value: "texas_republic_bank",
      },
      {
        name: "The Bancorp Bank",
        value: "the_bancorp_bank",
      },
      {
        name: "The Bank",
        value: "the_bank",
      },
      {
        name: "The Private Trust Company",
        value: "the_private_trust_company",
      },
      {
        name: "The Tipton Latham Bank",
        value: "the_tipton_latham_bank",
      },
      {
        name: "The Trust Company of Toledo",
        value: "the_trust_company_of_toledo",
      },
      {
        name: "Tioga State Bank",
        value: "tioga_state_bank",
      },
      {
        name: "Titan Bank",
        value: "titan_bank",
      },
      {
        name: "Town Bank",
        value: "town_bank",
      },
      {
        name: "Transact Bank",
        value: "transact_bank",
      },
      {
        name: "Triad Bank",
        value: "triad_bank",
      },
      {
        name: "Trinity Bank",
        value: "trinity_bank",
      },
      {
        name: "U.S. Bank Trust Company",
        value: "us_bank_trust_company",
      },
      {
        name: "UMB Bank",
        value: "umb_bank",
      },
      {
        name: "UMB Bank & Trust",
        value: "umb_bank_&_trust",
      },
      {
        name: "United Midwest Savings Bank",
        value: "united_midwest_savings_bank",
      },
      {
        name: "Vanguard National Trust Company",
        value: "vanguard_national_trust_company",
      },
      {
        name: "Varo Bank",
        value: "varo_bank",
      },
      {
        name: "VeraBank",
        value: "verabank",
      },
      {
        name: "WNB Financial",
        value: "wnb_financial",
      },
      {
        name: "Webster Bank",
        value: "webster_bank",
      },
      {
        name: "Wellington Trust Company",
        value: "wellington_trust_company",
      },
      {
        name: "Wells Fargo Bank South Central",
        value: "wells_fargo_bank_south_central",
      },
      {
        name: "Wells Fargo Trust Company",
        value: "wells_fargo_trust_company",
      },
      {
        name: "Western Alliance Trust Company",
        value: "western_alliance_trust_company",
      },
      {
        name: "Wheaton Bank & Trust Company",
        value: "wheaton_bank_&_trust_company",
      },
      {
        name: "Wilmington Trust",
        value: "wilmington_trust",
      },
      {
        name: "Wintrust Bank",
        value: "wintrust_bank",
      },
      {
        name: "Wintrust Private Trust Company",
        value: "wintrust_private_trust_company",
      },
      {
        name: "Zions Bancorporation",
        value: "zions_bancorporation",
      },
    ],
};
  

export default BANKS;