import {Card, Input, InputNumber, Radio, Space} from "antd";
import {useState} from "react";
import currencyjs from "currency.js";

const subUnsubFee = 1.057;
const plusFee = 4.228;
const subUnsubDecimal = 0.01057;
const plusDecimal = 0.04228;
const subUnsubNeedDecimal = (100-subUnsubFee)/100;
const plusNeedDecimal = (100-plusFee)/100;

export const LoanFeeCalculator = () => {
    const [type, setType] = useState<'direct' | 'PLUS'>('direct')
    const [calculateMethod, setCalculateMethod] = useState<'borrow' | 'disburse'>('disburse')
    const [amount, setAmount] = useState<number>(0)
    const currency = currencyjs(amount, {precision: 2})

    // fee must round up to the nearest dollar
    let fee = currencyjs(0, {precision: 2})
    let toRequest = currencyjs(0, {precision: 2})

    if(calculateMethod === 'borrow') {
        if(type === 'direct') {
            const feeAmount = Math.floor(amount / subUnsubNeedDecimal) - amount || 0;
            fee = currencyjs(feeAmount, {precision: 2})
            toRequest = currency.add(fee)
        } else {
            const feeAmount = Math.floor(amount / plusNeedDecimal) - amount || 0;
            fee = currencyjs(feeAmount, {precision: 2})
            toRequest = currency.add(fee)
        }
    } else {
        if(type === 'direct') {
            const feeAmount = Math.floor(amount * subUnsubDecimal) || 0;
            fee = currencyjs(feeAmount, {precision: 2})
        } else {
            const feeAmount = Math.floor(amount * plusDecimal) || 0;
            fee = currencyjs(feeAmount, {precision: 2})
        }
    }

    return <Card
        title="Loan Fee Calculator"
        style={{ width: 300 }}
        size={"small"}
    >
        <Space direction={'vertical'}>
            <div>
                <h3>Loan Type</h3>
                <Radio.Group
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <Radio value="direct">Unsub/Sub</Radio>
                    <Radio value="PLUS">PLUS</Radio>
                </Radio.Group>
            </div>
            <div>
                <h3>Calculate Method</h3>
                <Radio.Group
                    value={calculateMethod}
                    onChange={(e) => setCalculateMethod(e.target.value)}
                >
                    <Radio value="borrow">I will borrow</Radio>
                    <Radio value="disburse">that will disburse</Radio>
                </Radio.Group>
            </div>
            <div>
                <h3>Amount {calculateMethod  === 'borrow' ? 'Needed' : 'Awarded'}</h3>
                <InputNumber style={{width: '100%'}} value={amount} onChange={(value) => setAmount(value as number)} />
            </div>
            <div>
                {calculateMethod === 'borrow' && (
                    <div>
                        <h3>Fee</h3>
                        <Input value={fee.format()} disabled />
                        <h3>Amount you will need to request</h3>
                        <Input value={toRequest.format()} disabled />
                    </div>
                )}
                {
                    calculateMethod === 'disburse' && (
                        <div>
                            <h3>Fee</h3>
                            <Input value={fee.format()} disabled />
                            <h3>Amount you will receive</h3>
                            <Input value={currency.subtract(fee).format()} disabled />
                        </div>
                    )
                }
            </div>
        </Space>

    </Card>
}