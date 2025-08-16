def collect_withdrawal_info():
    early_input = input("Are you withdrawing before 59½ age? (yes/no): ").strip().lower()
    is_early_withdrawal = early_input in ("yes", "y", "true", "t", "1")
    print(f"Early withdrawal: {'yes' if is_early_withdrawal else 'no'}")

    withdrawal_amount = float(input("Enter the amount you want to withdraw: ").strip())
    print(f"You entered withdrawal amount: {withdrawal_amount}")
    tax_due = calculate_tax(withdrawal_amount)
    print(f"Estimated federal tax on {withdrawal_amount} is: {tax_due}")

    inr_amount, india_tax = convert_to_inr(withdrawal_amount)
    print(f"The amount in INR is: ₹{inr_amount}")
    print(f"Estimated Indian tax on ₹{inr_amount} is: {india_tax}")

    # Convert U.S. tax to INR for comparison
    us_tax_in_inr = tax_due * 87
    print(f"U.S. tax converted to INR: ₹{us_tax_in_inr}")

    # Compare taxes
    if us_tax_in_inr > india_tax:
        print(f"U.S. tax is higher by ₹{us_tax_in_inr - india_tax}")
    elif india_tax > us_tax_in_inr:
        print(f"Indian tax is higher by ₹{india_tax - us_tax_in_inr}")
    else:
        print("Both U.S. and Indian taxes are equal.")

    # Determine where tax needs to be paid
    if india_tax > us_tax_in_inr:
        india_payable = india_tax - us_tax_in_inr
        usa_payable = us_tax_in_inr
    else:
        india_payable = 0
        usa_payable = us_tax_in_inr

    print(f"✅ Tax to pay in USA: ₹{usa_payable}")
    print(f"✅ Tax to pay in India: ₹{india_payable}")

    # Calculate penalty if early withdrawal
    if is_early_withdrawal:
        penalty = withdrawal_amount * 0.10
        print(f"Since you are withdrawing before 59½, the penalty is: {penalty}")
    else:
        penalty = 0
        print("No early withdrawal penalty.")

    total_deductions = tax_due + penalty
    final_amount = withdrawal_amount - total_deductions
    print(f"Total deductions (tax + penalty): {total_deductions}")
    print(f"Net amount you will receive: {final_amount}")
    # Take input from terminal and normalize Traditional vs Roth across 401k/IRA
    raw_input_plan = input("Enter your plan (401k, IRA, Roth 401k, Roth IRA): ").strip()
    normalized_plan = raw_input_plan.lower().replace(" ", "")

    if normalized_plan in ("401k", "ira", "traditionalira", "traditional401k"):
        print("You have chosen a traditional plan (401k/IRA).")
    elif normalized_plan in ("roth401k", "rothira", "roth"):
        print("You have chosen a Roth plan (Roth 401k/Roth IRA).")
    else:
        print(
            f"Unrecognized input: {raw_input_plan}. Please enter one of '401k', 'IRA', 'Roth 401k', or 'Roth IRA'."
        )

def calculate_tax(total_amount):
    """
    Calculate federal tax based on 2025 US tax brackets for a single filer.
    Uses progressive tax rates.
    """
    tax = 0.0
    brackets = [
        (11925, 0.10),
        (48475, 0.12),
        (103350, 0.22),
        (197300, 0.24),
        (250525, 0.32),
        (626350, 0.35)
    ]
    
    previous_limit = 0
    for limit, rate in brackets:
        if total_amount > limit:
            tax += (limit - previous_limit) * rate
            previous_limit = limit
        else:
            tax += (total_amount - previous_limit) * rate
            return tax
    
    # If income exceeds top bracket
    tax += (total_amount - previous_limit) * 0.37
    return tax

def convert_to_inr(total_amount):
    """
    Convert USD amount to INR using a fixed rate of 87.
    """
    inr_amount = total_amount * 87
    print(f"The amount in INR is: ₹{inr_amount}")
    
    """
    Calculate indian tax based on 2025
    """
    tax = 0.0
    brackets = [
        (300000, 0),
        (700000, 0.05),
        (1000000, 0.10),
        (1200000, 0.15),
        (1500000, 0.20)
    ]
    
    previous_limit = 0
    for limit, rate in brackets:
        if inr_amount > limit:
            tax += (limit - previous_limit) * rate
            previous_limit = limit
        else:
            tax += (inr_amount - previous_limit) * rate
            print(f"Estimated Indian tax on ₹{inr_amount} is: {tax}")
            return inr_amount, tax
    
    # If income exceeds top bracket
    tax += (inr_amount - previous_limit) * 0.30
    print(f"Estimated Indian tax on ₹{inr_amount} is: {tax}")
    return inr_amount, tax

collect_withdrawal_info()