"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  SaintSalHeadshot,
  SaintSalAvatar,
  SaintSalPremiumAvatar,
  SaintSalAIAvatar,
  SaintSalFounderAvatar,
  SaintSalProfile,
} from "./saintsol-headshot";

export const HeadshotShowcase = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SaintSal™ Headshot Gallery
          </h1>
          <p className="text-gray-600 text-lg">
            Dynamic avatar system with multiple variants and states
          </p>
        </div>

        {/* Size Variations */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Size Variations
          </h2>
          <div className="flex items-end gap-6 justify-center bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-center">
              <SaintSalAvatar size="xs" />
              <p className="mt-2 text-sm text-gray-600">Extra Small</p>
            </div>
            <div className="text-center">
              <SaintSalAvatar size="sm" />
              <p className="mt-2 text-sm text-gray-600">Small</p>
            </div>
            <div className="text-center">
              <SaintSalAvatar size="md" />
              <p className="mt-2 text-sm text-gray-600">Medium</p>
            </div>
            <div className="text-center">
              <SaintSalAvatar size="lg" />
              <p className="mt-2 text-sm text-gray-600">Large</p>
            </div>
            <div className="text-center">
              <SaintSalAvatar size="xl" />
              <p className="mt-2 text-sm text-gray-600">Extra Large</p>
            </div>
            <div className="text-center">
              <SaintSalAvatar size="2xl" />
              <p className="mt-2 text-sm text-gray-600">2X Large</p>
            </div>
          </div>
        </section>

        {/* Variant Types */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Variant Types
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <motion.div
              className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <SaintSalHeadshot variant="default" size="xl" />
              <h3 className="mt-4 font-semibold text-gray-800">Default</h3>
              <p className="text-sm text-gray-600">Standard user</p>
            </motion.div>

            <motion.div
              className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <SaintSalHeadshot variant="premium" size="xl" />
              <h3 className="mt-4 font-semibold text-gray-800">Premium</h3>
              <p className="text-sm text-gray-600">Pro subscriber</p>
            </motion.div>

            <motion.div
              className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <SaintSalHeadshot variant="enterprise" size="xl" />
              <h3 className="mt-4 font-semibold text-gray-800">Enterprise</h3>
              <p className="text-sm text-gray-600">Business user</p>
            </motion.div>

            <motion.div
              className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <SaintSalHeadshot variant="ai" size="xl" />
              <h3 className="mt-4 font-semibold text-gray-800">AI Assistant</h3>
              <p className="text-sm text-gray-600">AI persona</p>
            </motion.div>

            <motion.div
              className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <SaintSalHeadshot variant="founder" size="xl" />
              <h3 className="mt-4 font-semibold text-gray-800">Founder</h3>
              <p className="text-sm text-gray-600">Leadership</p>
            </motion.div>
          </div>
        </section>

        {/* Status States */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Status States
          </h2>
          <div className="flex gap-8 justify-center bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-center">
              <SaintSalFounderAvatar size="lg" status="online" />
              <p className="mt-2 text-sm text-gray-600">Online</p>
            </div>
            <div className="text-center">
              <SaintSalFounderAvatar size="lg" status="busy" />
              <p className="mt-2 text-sm text-gray-600">Busy</p>
            </div>
            <div className="text-center">
              <SaintSalFounderAvatar size="lg" status="away" />
              <p className="mt-2 text-sm text-gray-600">Away</p>
            </div>
            <div className="text-center">
              <SaintSalFounderAvatar size="lg" status="offline" />
              <p className="mt-2 text-sm text-gray-600">Offline</p>
            </div>
          </div>
        </section>

        {/* Profile Components */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Profile Components
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <SaintSalProfile
                name="SaintSal"
                title="AI Vision Architect"
                variant="founder"
                status="online"
              />
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <SaintSalProfile
                name="AI Assistant"
                title="Dual Model Processor"
                variant="ai"
                status="busy"
                size="md"
              />
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <SaintSalProfile
                name="Premium User"
                title="Advanced Features"
                variant="premium"
                status="online"
                size="md"
              />
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <SaintSalProfile
                name="Enterprise Admin"
                title="System Administrator"
                variant="enterprise"
                status="away"
                size="md"
              />
            </motion.div>
          </div>
        </section>

        {/* Interactive Options */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Interactive Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <SaintSalHeadshot
                variant="default"
                size="xl"
                animated={true}
                showStatus={true}
                showBadge={true}
              />
              <h3 className="mt-4 font-semibold">Fully Animated</h3>
              <p className="text-sm text-gray-600">Hover for effects</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <SaintSalHeadshot
                variant="premium"
                size="xl"
                animated={false}
                showStatus={false}
                showBadge={true}
              />
              <h3 className="mt-4 font-semibold">Static Mode</h3>
              <p className="text-sm text-gray-600">No animations</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <SaintSalHeadshot
                variant="ai"
                size="xl"
                animated={true}
                showStatus={false}
                showBadge={false}
              />
              <h3 className="mt-4 font-semibold">Clean Mode</h3>
              <p className="text-sm text-gray-600">No indicators</p>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Usage Examples
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <SaintSalAvatar size="sm" />
                <div>
                  <p className="font-medium">Chat Interface</p>
                  <p className="text-sm text-gray-600">
                    Small avatar in conversations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <SaintSalPremiumAvatar size="md" />
                <div>
                  <p className="font-medium">User Profile</p>
                  <p className="text-sm text-gray-600">
                    Medium avatar for profiles
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <SaintSalFounderAvatar size="lg" />
                <div>
                  <p className="font-medium">About Page</p>
                  <p className="text-sm text-gray-600">
                    Large avatar for introductions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
