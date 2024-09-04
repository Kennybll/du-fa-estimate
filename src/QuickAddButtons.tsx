import { Button, Card, Divider } from "antd";

type props = {
  onAddFee: (name: string) => void;
  onAddAid: (name: string) => void;
};

export const QuickAddButtons = ({ onAddAid, onAddFee }: props) => {
  return (
    <Card title="Quick Add Buttons" size="small" style={{ width: 600 }}>
      <Button onClick={() => onAddFee("Meal Plan")}>Meal Plan</Button>
      <Button onClick={() => onAddFee("Residence Hall Charges")}>
        Residence Hall Charges
      </Button>
      <Button onClick={() => onAddFee("Housing Cancellation Charge")}>
        Housing Cancellation Charge
      </Button>

      <Divider />

      <Button onClick={() => onAddAid("DU Tuition Grant")}>
        DU Tuition Grant
      </Button>
      <Button onClick={() => onAddAid("Michigan Tuition Grant")}>
        Michigan Tuition Grant
      </Button>
      <Button onClick={() => onAddAid("Federal Pell Grant")}>
        Federal Pell Grant
      </Button>
      <Button onClick={() => onAddAid("Federal Direct Subsidized Loan")}>
        Federal Direct Subsidized Loan
      </Button>
      <Button onClick={() => onAddAid("Federal Direct Unsubsidized Loan")}>
        Federal Direct Unsubsidized Loan
      </Button>

      <Divider />

      <Button onClick={() => onAddAid("DU Nursing Grant $8,000/yr max")}>
        DU Nursing Grant $8,000/yr max
      </Button>
      <Button onClick={() => onAddAid("Excellence $8,000/yr max")}>
        Excellence $8,000/yr max
      </Button>
      <Button onClick={() => onAddAid("Achievement $6,500/yr max")}>
        Achievement $6,500/yr max
      </Button>
      <Button onClick={() => onAddAid("Signature $5,000/yr max")}>
        Signature $5,000/yr max
      </Button>

      <Divider />

      <Button onClick={() => onAddAid("Panther Distinguished $6,500/yr max")}>
        Panther Distinguished $6,500/yr max
      </Button>
      <Button onClick={() => onAddAid("Panther Honors $5,500/yr max")}>
        Panther Honors $5,500/yr max
      </Button>
      <Button onClick={() => onAddAid("Phi Theta Kappa")}>
        Phi Theta Kappa
      </Button>

      <Divider />

      <Button onClick={() => onAddAid("Medallion $2,000/yr Max")}>
        Medallion $2,000/yr Max
      </Button>
      <Button onClick={() => onAddAid("Scholars $1,500/yr Max")}>
        Scholars $1,500/yr Max
      </Button>
      <Button onClick={() => onAddAid("Graduate $1,000/yr Max")}>
        Graduate $1,000/yr Max
      </Button>

      <Divider />

      <Button onClick={() => onAddAid("Titanium $6,000/yr Max")}>
        Titanium $6,000/yr Max
      </Button>
      <Button onClick={() => onAddAid("Platinum $4,000/yr Max")}>
        Platinum $4,000/yr Max
      </Button>
      <Button onClick={() => onAddAid("Gold $3,000/yr Max")}>
        Gold $3,000/yr Max
      </Button>
      <Button onClick={() => onAddAid("Silver $2,000/yr Max")}>
        Silver $2,000/yr Max
      </Button>

      <Divider />

      <Button onClick={() => onAddAid("Check - Web Payment")}>
        Check - Web Payment
      </Button>
    </Card>
  );
};
