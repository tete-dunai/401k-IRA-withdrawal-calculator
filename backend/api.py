from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# Reuse logic analogous to 401_calculator.py (copied here to avoid import name starting with a digit)
def calculate_tax(total_amount: float) -> float:
    tax = 0.0
    brackets = [
        (11925, 0.10),
        (48475, 0.12),
        (103350, 0.22),
        (197300, 0.24),
        (250525, 0.32),
        (626350, 0.35),
    ]

    previous_limit = 0.0
    for limit, rate in brackets:
        if total_amount > limit:
            tax += (limit - previous_limit) * rate
            previous_limit = float(limit)
        else:
            tax += (total_amount - previous_limit) * rate
            return tax

    tax += (total_amount - previous_limit) * 0.37
    return tax


def convert_to_inr(total_amount: float) -> tuple[float, float]:
    inr_amount = total_amount * 87

    tax = 0.0
    brackets = [
        (300000, 0),
        (700000, 0.05),
        (1000000, 0.10),
        (1200000, 0.15),
        (1500000, 0.20),
    ]

    previous_limit = 0.0
    for limit, rate in brackets:
        if inr_amount > limit:
            tax += (limit - previous_limit) * rate
            previous_limit = float(limit)
        else:
            tax += (inr_amount - previous_limit) * rate
            return inr_amount, tax

    tax += (inr_amount - previous_limit) * 0.30
    return inr_amount, tax


def format_usd(amount: float) -> str:
    return "$" + f"{amount:,.0f}" if abs(amount) >= 1 else "$" + f"{amount:,.2f}"


def format_inr(amount: float) -> str:
    return "₹" + f"{amount:,.0f}" if abs(amount) >= 1 else "₹" + f"{amount:,.2f}"


class RequestBody(BaseModel):
    isEarlyWithdrawal: bool
    amountUsd: float
    planType: str  # "401k" | "IRA" | "Roth 401k" | "Roth IRA"


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/withdrawal-calculation")
def calculate_endpoint(body: RequestBody):
    amount_usd = float(body.amountUsd)
    is_early = bool(body.isEarlyWithdrawal)
    plan = body.planType.strip().lower().replace(" ", "")

    # Normalize plan to traditional vs roth (behavior placeholder)
    is_roth = plan in ("roth401k", "rothira", "roth")

    usa_tax_usd = calculate_tax(amount_usd)
    penalty_usd = amount_usd * 0.10 if is_early else 0.0
    inr_amount, india_tax_inr = convert_to_inr(amount_usd)
    exchange_rate = 87.0

    # Simple assumption: NRI no India tax, RNOR/ROR taxed in India
    india_tax_by_residency = {
        "NRI": 0.0,
        "RNOR": india_tax_inr,
        "ROR": india_tax_inr,
    }

    results: dict[str, dict[str, str]] = {}
    for residency, india_tax_val in india_tax_by_residency.items():
        total_deducted_usd = usa_tax_usd + penalty_usd + (india_tax_val / exchange_rate)
        total_receivable_usd = amount_usd - total_deducted_usd
        results[residency] = {
            "usaTax": format_usd(usa_tax_usd),
            "indiaTax": format_inr(india_tax_val),
            "penalty": format_usd(penalty_usd),
            "totalDeducted": format_usd(total_deducted_usd),
            "totalReceivable": format_usd(total_receivable_usd),
        }

    return {
        "results": results,
        "meta": {"exchangeRateUsdToInr": exchange_rate, "isRoth": is_roth},
    }


