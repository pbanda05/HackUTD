import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { DollarSign, Percent, Calendar, ChevronLeft } from 'lucide-react';

export default function FinancingStage({ selectedModel, customization, onBack, onComplete }) {
  const totalPrice = customization?.totalPrice || selectedModel?.price || 0;
  
  const [financeType, setFinanceType] = useState('finance');
  const [downPayment, setDownPayment] = useState(Math.round(totalPrice * 0.2) || 0);
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(4.9);

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    if (financeType === 'lease') {
      const residualValue = totalPrice * 0.5;
      const monthlyDepreciation = (totalPrice - residualValue) / loanTerm;
      const monthlyFinanceCharge = (totalPrice + residualValue) * (interestRate / 100 / 12);
      return Math.round(monthlyDepreciation + monthlyFinanceCharge);
    } else {
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
      className="max-w-7xl mx-auto relative min-h-[calc(100vh-200px)] flex flex-col justify-center items-center w-full"
    >
      {/* Back Button */}
      {onBack && (
        <motion.button
          type="button"
          onClick={onBack}
          className="fixed top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer z-30 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>
      )}
      
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Monthly Payment Display */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 relative overflow-hidden border border-gray-700">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent" />
            <div className="relative z-10">
              {/* Monthly Payment Gauge */}
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
                    <p className="text-sm text-gray-400">Total Price</p>
                  </div>
                  <p className="text-2xl font-bold text-white">${totalPrice.toLocaleString()}</p>
                </div>
                
                <div className="bg-black/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-gray-400">APR Rate</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{interestRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Finance Controls */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
            {/* Finance Type Toggle */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Payment Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={() => setFinanceType('finance')}
                  className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    financeType === 'finance'
                      ? 'bg-red-600 ring-4 ring-red-500/30'
                      : 'bg-gray-800/50 hover:bg-gray-800'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DollarSign className="w-6 h-6 text-white mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Finance</p>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setFinanceType('lease')}
                  className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    financeType === 'lease'
                      ? 'bg-red-600 ring-4 ring-red-500/30'
                      : 'bg-gray-800/50 hover:bg-gray-800'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar className="w-6 h-6 text-white mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Lease</p>
                </motion.button>
              </div>
            </div>

            {/* Down Payment Slider */}
            {financeType === 'finance' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Down Payment</h3>
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
                  value={downPayment}
                  onChange={(val) => setDownPayment(val)}
                  min={0}
                  max={totalPrice}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>$0</span>
                  <span>${Math.round(totalPrice / 2).toLocaleString()}</span>
                </div>
              </motion.div>
            )}

            {/* Loan Term Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">
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
                value={loanTerm}
                onChange={(val) => setLoanTerm(val)}
                min={24}
                max={84}
                step={12}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>24 mo</span>
                <span>84 mo</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">APR Rate</h3>
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
                value={interestRate}
                onChange={(val) => setInterestRate(val)}
                min={2.9}
                max={8.9}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>2.9%</span>
                <span>8.9%</span>
              </div>
            </div>

            {/* Summary Details */}
            <div className="bg-black/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Loan Amount</span>
                <span className="text-white font-semibold">${(totalPrice - downPayment).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Term</span>
                <span className="text-white font-semibold">{loanTerm} months</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-700">
                <span className="text-gray-300 font-semibold">Monthly Payment</span>
                <span className="text-red-500 text-lg font-bold">${monthlyPayment}</span>
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
        <button
          type="button"
          onClick={handleComplete}
          className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-lg font-bold rounded-lg shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 transition-all duration-300 hover:scale-105 uppercase tracking-wider cursor-pointer relative z-10 inline-flex items-center"
        >
          Complete Your Journey →
        </button>
      </motion.div>
    </motion.div>
  );
}
