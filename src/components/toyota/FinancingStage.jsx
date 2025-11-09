import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Slider } from '@/components/ui/slider';
import { ChevronRight, DollarSign, Calendar, Percent, TrendingDown, Fuel } from 'lucide-react';

export default function FinancingStage({ selectedModel, customization, onComplete }) {
  const totalPrice = customization.totalPrice;
  
  const [financeType, setFinanceType] = useState('finance'); // 'finance' or 'lease'
  const [downPayment, setDownPayment] = useState(Math.round(totalPrice * 0.2));
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(4.5);

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    if (financeType === 'lease') {
      // Simplified lease calculation
      const residualValue = totalPrice * 0.5;
      const monthlyDepreciation = (totalPrice - residualValue) / loanTerm;
      const monthlyFinanceCharge = (totalPrice + residualValue) * (interestRate / 100 / 12);
      return Math.round(monthlyDepreciation + monthlyFinanceCharge);
    } else {
      // Finance calculation
      const principal = totalPrice - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
        (Math.pow(1 + monthlyRate, loanTerm) - 1);
      return Math.round(payment);
    }
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPaid = financeType === 'finance' 
    ? downPayment + (monthlyPayment * loanTerm)
    : monthlyPayment * loanTerm;

  // Fuel gauge animation value (0-100)
  const [gaugeValue, setGaugeValue] = useState(0);
  
  useEffect(() => {
    const percentage = Math.min(100, (monthlyPayment / 1000) * 100);
    setGaugeValue(percentage);
  }, [monthlyPayment]);

  const handleComplete = () => {
    onComplete({
      financeType,
      downPayment,
      loanTerm,
      interestRate,
      monthlyPayment,
      totalPaid
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="max-w-6xl mx-auto"
    >
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Let's Talk <span className="text-red-600">Numbers</span>
        </h2>
        <p className="text-xl text-gray-300">
          Find the perfect payment plan for your budget
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left: Controls */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Finance Type Toggle */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Payment Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                onClick={() => setFinanceType('finance')}
                className={`p-6 rounded-2xl transition-all duration-300 ${
                  financeType === 'finance'
                    ? 'bg-red-600 ring-4 ring-red-500 ring-offset-2 ring-offset-black'
                    : 'bg-gray-900/50 hover:bg-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DollarSign className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-lg font-bold text-white">Finance</p>
                <p className="text-sm text-gray-300">Own it</p>
              </motion.button>
              <motion.button
                onClick={() => setFinanceType('lease')}
                className={`p-6 rounded-2xl transition-all duration-300 ${
                  financeType === 'lease'
                    ? 'bg-red-600 ring-4 ring-red-500 ring-offset-2 ring-offset-black'
                    : 'bg-gray-900/50 hover:bg-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-lg font-bold text-white">Lease</p>
                <p className="text-sm text-gray-300">Lower payments</p>
              </motion.button>
            </div>
          </div>

          {/* Down Payment Slider */}
          {financeType === 'finance' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Down Payment</h3>
                <motion.p
                  className="text-2xl font-black text-red-500"
                  key={downPayment}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  ${downPayment.toLocaleString()}
                </motion.p>
              </div>
              <Slider
                value={[downPayment]}
                onValueChange={(val) => setDownPayment(val[0])}
                min={0}
                max={totalPrice}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>$0</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </motion.div>
          )}

          {/* Loan Term Slider */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {financeType === 'finance' ? 'Loan Term' : 'Lease Term'}
              </h3>
              <motion.p
                className="text-2xl font-black text-red-500"
                key={loanTerm}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {loanTerm} months
              </motion.p>
            </div>
            <Slider
              value={[loanTerm]}
              onValueChange={(val) => setLoanTerm(val[0])}
              min={24}
              max={84}
              step={12}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>24 months</span>
              <span>84 months</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Interest Rate (APR)</h3>
              <motion.p
                className="text-2xl font-black text-red-500"
                key={interestRate}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {interestRate.toFixed(1)}%
              </motion.p>
            </div>
            <Slider
              value={[interestRate]}
              onValueChange={(val) => setInterestRate(val[0])}
              min={0}
              max={10}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>0%</span>
              <span>10%</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Summary & Fuel Gauge */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Fuel Gauge Visualization */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Fuel className="w-8 h-8 text-red-500" />
                <h3 className="text-2xl font-bold text-white">Payment Power</h3>
              </div>

              {/* Circular Gauge */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg className="transform -rotate-90" width="256" height="256">
                  {/* Background circle */}
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    fill="none"
                    stroke="#1F2937"
                    strokeWidth="20"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="110"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 110}
                    initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 110 * (1 - gaugeValue / 100)
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.p
                    className="text-5xl font-black text-white"
                    key={monthlyPayment}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    ${monthlyPayment}
                  </motion.p>
                  <p className="text-gray-400 text-sm">per month</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-gray-400">Vehicle Price</p>
                  </div>
                  <p className="text-2xl font-bold text-white">${totalPrice.toLocaleString()}</p>
                </div>
                
                <div className="bg-black/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-gray-400">APR</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{interestRate.toFixed(1)}%</p>
                </div>

                {financeType === 'finance' && (
                  <div className="bg-black/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <p className="text-sm text-gray-400">Down Payment</p>
                    </div>
                    <p className="text-2xl font-bold text-white">${downPayment.toLocaleString()}</p>
                  </div>
                )}

                <div className="bg-black/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-gray-400">Term</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{loanTerm} mo</p>
                </div>

                <div className="col-span-2 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-1">Total Amount Paid</p>
                  <p className="text-3xl font-black text-white">${totalPaid.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={handleComplete}
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-xl rounded-full shadow-2xl shadow-red-600/50 hover:scale-105 transition-all"
        >
          See Your Dream Car
          <ChevronRight className="w-6 h-6 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}