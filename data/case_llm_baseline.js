window.CASE_LLM_BASELINE = {
  "version": "polymarket-case-closed-llm-baseline-v0",
  "generated_at_utc": "2026-08-11T10:28:52.140854+00:00",
  "status": "demo_only_not_track_a",
  "model": "gpt-5.6-sol",
  "model_reasoning_effort": "low",
  "model_tool_calls": 0,
  "protocol": {
    "source": "Data Atlas downsampled 1h case trajectories",
    "cases": 5,
    "holdout": "last ceil(10%) points, minimum 2, maximum 12",
    "information_given_to_model": "anonymous relative-hour and transformed probability history only",
    "withheld": [
      "event and market identity",
      "question and outcomes",
      "absolute timestamps",
      "future values",
      "repository and web access"
    ],
    "orientation_blinding": "alternating series use p -> 1-p; decoded before scoring",
    "evaluation": "micro-average over every hidden displayed point"
  },
  "aggregate": {
    "closed_llm": {
      "mae": 0.04455102040816329,
      "rmse": 0.10806035728391118
    },
    "persistence": {
      "mae": 0.044061224489795915,
      "rmse": 0.10838037701747018
    },
    "recent_linear_drift": {
      "mae": 0.04768027445934828,
      "rmse": 0.10715927728582021
    }
  },
  "cases": [
    {
      "series_id": "series_01",
      "case_slug": "long-trajectory",
      "market_id": "253591",
      "display_points": 260,
      "history_points": 248,
      "holdout_points": 12,
      "target_relative_hours": [
        7106.0,
        7128.0,
        7149.0,
        7171.0,
        7193.0,
        7214.0,
        7236.0,
        7266.0,
        7287.0,
        7309.0,
        7331.0,
        7353.0
      ],
      "target": [
        0.647,
        0.652,
        0.663,
        0.664,
        0.647,
        0.635,
        0.595,
        0.588,
        0.5409999999999999,
        0.581,
        0.609,
        0.998
      ],
      "predictions": {
        "closed_llm": [
          0.64,
          0.641,
          0.642,
          0.643,
          0.644,
          0.645,
          0.646,
          0.647,
          0.648,
          0.649,
          0.65,
          0.651
        ],
        "persistence": [
          0.639,
          0.639,
          0.639,
          0.639,
          0.639,
          0.639,
          0.639,
          0.639,
          0.639,
          0.639,
          0.639,
          0.639
        ],
        "recent_linear_drift": [
          0.6484641786891031,
          0.6535485237624304,
          0.6584017622415158,
          0.6634861073148431,
          0.6685704523881705,
          0.6734236908672558,
          0.6785080359405832,
          0.6854412337678478,
          0.6902944722469332,
          0.6953788173202605,
          0.7004631623935879,
          0.7055475074669154
        ]
      },
      "metrics": {
        "closed_llm": {
          "mae": 0.062166666666666696,
          "rmse": 0.11007800264660815
        },
        "persistence": {
          "mae": 0.060166666666666695,
          "rmse": 0.11135528725660045
        },
        "recent_linear_drift": {
          "mae": 0.07472143252940819,
          "rmse": 0.11094342549287614
        }
      },
      "llm_rationale": "Damped local-trend extrapolation from the recent elevated regime, with smoothing to reduce short-term oscillations and all forecasts constrained to the probability interval."
    },
    {
      "series_id": "series_02",
      "case_slug": "multi-market-event",
      "market_id": "1776899",
      "display_points": 7,
      "history_points": 5,
      "holdout_points": 2,
      "target_relative_hours": [
        5.0,
        6.0
      ],
      "target": [
        0.999,
        0.999
      ],
      "predictions": {
        "closed_llm": [
          0.999,
          0.999
        ],
        "persistence": [
          0.999,
          0.999
        ],
        "recent_linear_drift": [
          1.0,
          1.0
        ]
      },
      "metrics": {
        "closed_llm": {
          "mae": 0.0,
          "rmse": 0.0
        },
        "persistence": {
          "mae": 0.0,
          "rmse": 0.0
        },
        "recent_linear_drift": {
          "mae": 0.0010000000000000009,
          "rmse": 0.0010000000000000009
        }
      },
      "llm_rationale": "Persistence forecast at the stable lower-bound plateau observed in the latest values."
    },
    {
      "series_id": "series_03",
      "case_slug": "deadline-family",
      "market_id": "2036399",
      "display_points": 246,
      "history_points": 234,
      "holdout_points": 12,
      "target_relative_hours": [
        234.0,
        235.0,
        236.0,
        237.0,
        238.0,
        239.0,
        240.0,
        241.0,
        242.0,
        243.0,
        244.0,
        245.0
      ],
      "target": [
        0.001,
        0.0020000000000000018,
        0.0020000000000000018,
        0.001,
        0.0020000000000000018,
        0.001,
        0.006,
        0.0040000000000000036,
        0.0030000000000000027,
        0.0020000000000000018,
        0.0020000000000000018,
        0.001
      ],
      "predictions": {
        "closed_llm": [
          0.002,
          0.002,
          0.002,
          0.002,
          0.002,
          0.002,
          0.002,
          0.002,
          0.002,
          0.002,
          0.002,
          0.002
        ],
        "persistence": [
          0.0020000000000000018,
          0.0020000000000000018,
          0.0020000000000000018,
          0.0020000000000000018,
          0.0020000000000000018,
          0.0020000000000000018,
          0.0020000000000000018,
          0.0020000000000000018,
          0.0020000000000000018,
          0.0020000000000000018,
          0.0020000000000000018,
          0.0020000000000000018
        ],
        "recent_linear_drift": [
          0.0015757575757575637,
          0.001446386946386935,
          0.0013170163170163098,
          0.001187645687645681,
          0.0010582750582750523,
          0.0009289044289044236,
          0.0007995337995337949,
          0.0006701631701631662,
          0.000540792540792541,
          0.00041142191142191226,
          0.00028205128205128355,
          0.00015268065268065484
        ]
      },
      "metrics": {
        "closed_llm": {
          "mae": 0.0009166666666666677,
          "rmse": 0.001443375672974065
        },
        "persistence": {
          "mae": 0.0009166666666666672,
          "rmse": 0.0014433756729740645
        },
        "recent_linear_drift": {
          "mae": 0.0015130147630147653,
          "rmse": 0.002089752852629705
        }
      },
      "llm_rationale": "Robust local-level forecast using the recent near-zero plateau while ignoring the isolated historical spike."
    },
    {
      "series_id": "series_04",
      "case_slug": "non-binary-label",
      "market_id": "1269423",
      "display_points": 260,
      "history_points": 248,
      "holdout_points": 12,
      "target_relative_hours": [
        324.0,
        325.0,
        327.0,
        328.0,
        329.0,
        331.0,
        332.0,
        333.0,
        335.0,
        336.0,
        337.0,
        339.0
      ],
      "target": [
        0.69,
        0.68,
        0.68,
        0.68,
        0.6799999999999999,
        0.68,
        0.68,
        0.8200000000000001,
        0.999,
        0.999,
        0.999,
        0.999
      ],
      "predictions": {
        "closed_llm": [
          0.6799999999999999,
          0.6799999999999999,
          0.6799999999999999,
          0.6799999999999999,
          0.6799999999999999,
          0.6799999999999999,
          0.6799999999999999,
          0.6799999999999999,
          0.6799999999999999,
          0.6799999999999999,
          0.6799999999999999,
          0.6799999999999999
        ],
        "persistence": [
          0.68,
          0.68,
          0.68,
          0.68,
          0.68,
          0.68,
          0.68,
          0.68,
          0.68,
          0.68,
          0.68,
          0.68
        ],
        "recent_linear_drift": [
          0.6817043536955788,
          0.6819068511643605,
          0.6823118461019237,
          0.6825143435707054,
          0.682716841039487,
          0.6831218359770503,
          0.6833243334458319,
          0.6835268309146136,
          0.6839318258521768,
          0.6841343233209585,
          0.6843368207897401,
          0.6847418157273034
        ]
      },
      "metrics": {
        "closed_llm": {
          "mae": 0.11883333333333342,
          "rmse": 0.1885788959560428
        },
        "persistence": {
          "mae": 0.1188333333333333,
          "rmse": 0.18857889595604274
        },
        "recent_linear_drift": {
          "mae": 0.11829334008324895,
          "rmse": 0.18594728105648758
        }
      },
      "llm_rationale": "Local-level persistence at the long-running stable center, with negligible trend across irregular observation gaps."
    },
    {
      "series_id": "series_05",
      "case_slug": "invalid-catalog-date",
      "market_id": "1994007",
      "display_points": 106,
      "history_points": 95,
      "holdout_points": 11,
      "target_relative_hours": [
        95.0,
        96.0,
        97.0,
        98.0,
        99.0,
        100.0,
        101.0,
        102.0,
        103.0,
        104.0,
        105.0
      ],
      "target": [
        0.999,
        0.999,
        0.999,
        0.999,
        0.999,
        0.999,
        0.999,
        0.999,
        0.999,
        0.999,
        0.999
      ],
      "predictions": {
        "closed_llm": [
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999
        ],
        "persistence": [
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999,
          0.999
        ],
        "recent_linear_drift": [
          0.9989999999999998,
          0.9989999999999998,
          0.9989999999999998,
          0.9989999999999998,
          0.9989999999999997,
          0.9989999999999997,
          0.9989999999999997,
          0.9989999999999997,
          0.9989999999999997,
          0.9989999999999997,
          0.9989999999999997
        ]
      },
      "metrics": {
        "closed_llm": {
          "mae": 0.0,
          "rmse": 0.0
        },
        "persistence": {
          "mae": 0.0,
          "rmse": 0.0
        },
        "recent_linear_drift": {
          "mae": 2.9269516103754126e-16,
          "rmse": 2.9752771908790836e-16
        }
      },
      "llm_rationale": "Boundary-aware persistence forecast at the sustained upper plateau."
    }
  ]
};
