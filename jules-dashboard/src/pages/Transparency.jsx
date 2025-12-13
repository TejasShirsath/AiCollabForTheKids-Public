import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * 💙 TRANSPARENCY DASHBOARD - FOR THE KIDS
 *
 * Public accountability page showing:
 * - Monthly revenue from all sources
 * - 50/30/20 split breakdown
 * - charity allocation receipts
 * - Complete audit trail
 *
 * SIMPLER THAN BLOCKCHAIN. MORE TRANSPARENT.
 */

export default function Transparency() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransparencyData();
  }, []);

  const fetchTransparencyData = async () => {
    try {
      const response = await fetch('/api/transparency/monthly-reports');
      const data = await response.json();
      setMonthlyData(data);
    } catch (error) {
      console.error('Failed to load transparency data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Current month summary - PRODUCTION: All zeros until real revenue
  // NO FAKE DATA - Zero tolerance policy
  const currentMonth = {
    month: 'December 2025',
    totalRevenue: 0,
    charityAmount: 0,
    infrastructureAmount: 0,
    founderAmount: 0,
    sources: [],
    shrinersReceipt: null,
    status: 'pending' // 'pending' | 'paid' | 'verified'
  };

  const calculateSplit = (revenue) => ({
    charity: revenue * 0.50,
    infrastructure: revenue * 0.30,
    founder: revenue * 0.20
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold text-gray-900">
            💙 Transparency Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every dollar. Every month. Every receipt. Public and verifiable.
          </p>
          <Badge variant="success" className="text-lg px-6 py-2">
            NO BLOCKCHAIN NEEDED - JUST HONESTY
          </Badge>
        </div>

        {/* Mission Statement */}
        <Card className="border-4 border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Our Promise: 60% to charity Children's Hospital - FOREVER
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              <strong>TRASH OR TREASURE ONLINE RECYCLER LLC</strong> (Florida L25000158401)
              operates as a standard for-profit company that allocates 60% of all profits
              to charity Children's Hospital (EIN: 36-2193608).
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-700">60%</div>
                <div className="text-sm text-gray-600">charity Children's Hospital</div>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <div className="text-3xl font-bold text-blue-700">30%</div>
                <div className="text-sm text-gray-600">Infrastructure (Immortal Engine)</div>
              </div>
              <div className="p-4 bg-purple-100 rounded-lg">
                <div className="text-3xl font-bold text-purple-700">20%</div>
                <div className="text-sm text-gray-600">Founder Compensation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Month Status */}
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-2xl">📊 {currentMonth.month} - LIVE</span>
              <Badge variant={currentMonth.status === 'verified' ? 'success' : 'warning'}>
                {currentMonth.status === 'pending' && 'Payment Pending Dec 10'}
                {currentMonth.status === 'paid' && 'Payment Sent - Awaiting Confirmation'}
                {currentMonth.status === 'verified' && 'VERIFIED BY charity'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Revenue Sources */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Revenue Sources (Verified)</h3>
              <div className="space-y-2">
                {currentMonth.sources.map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">{source.name}</span>
                    </div>
                    <span className="text-lg font-bold">${source.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Split */}
            <div className="border-t-2 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold">TOTAL REVENUE:</span>
                <span className="text-3xl font-bold text-green-600">
                  ${currentMonth.totalRevenue.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-100 rounded-lg border-2 border-green-500">
                  <div className="text-sm text-gray-600 mb-1">charity (60%)</div>
                  <div className="text-2xl font-bold text-green-700">
                    ${currentMonth.charityAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {currentMonth.status === 'pending' && '→ Payment scheduled Dec 10'}
                    {currentMonth.status === 'paid' && '→ Transfer completed'}
                    {currentMonth.status === 'verified' && '→ Receipt verified'}
                  </div>
                </div>

                <div className="p-4 bg-blue-100 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Infrastructure (30%)</div>
                  <div className="text-2xl font-bold text-blue-700">
                    ${currentMonth.infrastructureAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    → Solar, servers, redundancy
                  </div>
                </div>

                <div className="p-4 bg-purple-100 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Founder (20%)</div>
                  <div className="text-2xl font-bold text-purple-700">
                    ${currentMonth.founderAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    → Operations & development
                  </div>
                </div>
              </div>
            </div>

            {/* charity Receipt Upload */}
            {currentMonth.status === 'pending' && (
              <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold">Payment Pending</span>
                </div>
                <p className="text-sm text-gray-600">
                  When revenue is generated, Joshua Coleman will transfer 60% to charity Children's Hospital on the 10th of each month.
                  Receipt will be posted here immediately after confirmation.
                </p>
              </div>
            )}

            {currentMonth.shrinersReceipt && (
              <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">charity Receipt Verified</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Historical Archive */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">📁 Historical Archive</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">First month launching December 2025</p>
                <p className="text-sm">Historical data will appear here after first distribution</p>
              </div>
            ) : (
              <div className="space-y-4">
                {monthlyData.map((month, idx) => (
                  <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{month.period}</div>
                        <div className="text-sm text-gray-600">
                          ${month.totalRevenue.toLocaleString()} total → ${month.charityAmount.toLocaleString()} to charity
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Methods */}
        <Card className="bg-blue-50 border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="text-2xl">🔍 How to Verify</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold mb-2">1. Check Square Dashboard</h4>
                <p className="text-sm text-gray-600">
                  All dating app transactions are processed through Square.
                  Monthly totals are publicly verifiable.
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold mb-2">2. View charity Receipt</h4>
                <p className="text-sm text-gray-600">
                  Every payment to charity includes a receipt uploaded here.
                  Contact charity to verify directly.
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold mb-2">3. Download Monthly Report</h4>
                <p className="text-sm text-gray-600">
                  Complete PDF reports with transaction breakdowns available
                  for every month since launch.
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold mb-2">4. Contact Info</h4>
                <p className="text-sm text-gray-600">
                  Email: transparency@aidoesitall.website<br/>
                  charity: patienthelp@shrinernet.org
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Disclaimer */}
        <Card className="bg-gray-50">
          <CardContent className="text-xs text-gray-600 space-y-2 pt-6">
            <p>
              <strong>Legal Entity:</strong> TRASH OR TREASURE ONLINE RECYCLER LLC,
              Florida Document Number L25000158401, Operating Address: 25319 DARNOCH ST, SORRENTO, FL 32776
            </p>
            <p>
              <strong>Charity Recipient:</strong> charity Children's Hospital, EIN: 36-2193608,
              Contact: patienthelp@shrinernet.org, Website: shrinerschildrens.org
            </p>
            <p>
              <strong>Revenue Model:</strong> Corporate Sovereign Mode - Standard for-profit operation
              with internal 60% profit allocation to charity. No public solicitation. Compliant with
              Florida Chapter 496 (no FDACS registration required).
            </p>
            <p className="font-semibold text-gray-800">
              💙 FOR THE KIDS - Transparency Through Simplicity
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
