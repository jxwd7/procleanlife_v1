const { User, Job, JobPhoto, Offer, Message, Payment } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Payment.destroy({ where: {} });
    await Message.destroy({ where: {} });
    await Offer.destroy({ where: {} });
    await JobPhoto.destroy({ where: {} });
    await Job.destroy({ where: {} });
    await User.destroy({ where: {} });
    
    console.log('🧹 Cleared existing data');

    // Create Users (Customers and Cleaners)
    const users = await User.bulkCreate([
      // Customers
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0101',
        role: 'customer',
        password: 'hashedpassword123',
        isVerified: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1-555-0102',
        role: 'customer',
        password: 'hashedpassword123',
        isVerified: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '+1-555-0103',
        role: 'customer',
        password: 'hashedpassword123',
        isVerified: true,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      },
      {
        name: 'David Thompson',
        email: 'david.thompson@email.com',
        phone: '+1-555-0104',
        role: 'customer',
        password: 'hashedpassword123',
        isVerified: true,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      },
      
      // Cleaners
      {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1-555-0201',
        role: 'cleaner',
        password: 'hashedpassword123',
        isVerified: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        name: 'James Wilson',
        email: 'james.wilson@email.com',
        phone: '+1-555-0202',
        role: 'cleaner',
        password: 'hashedpassword123',
        isVerified: true,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@email.com',
        phone: '+1-555-0203',
        role: 'cleaner',
        password: 'hashedpassword123',
        isVerified: true,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18')
      },
      {
        name: 'Robert Martinez',
        email: 'robert.martinez@email.com',
        phone: '+1-555-0204',
        role: 'cleaner',
        password: 'hashedpassword123',
        isVerified: true,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25')
      },
      {
        name: 'Amanda Taylor',
        email: 'amanda.taylor@email.com',
        phone: '+1-555-0205',
        role: 'cleaner',
        password: 'hashedpassword123',
        isVerified: true,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      }
    ]);

    console.log('👥 Created users');

    // Get customer and cleaner IDs
    const customers = users.filter(user => user.role === 'customer');
    const cleaners = users.filter(user => user.role === 'cleaner');

    // Create Jobs
    const jobs = await Job.bulkCreate([
      {
        customerId: customers[0].id,
        title: 'Deep Clean 3BR Apartment',
        location: '123 Oak Street, Downtown, NY 10001',
        status: 'open',
        basePrice: '150.00',
        recurrence: 'once',
        scheduledAt: new Date('2024-06-30T10:00:00'),
        details: {
          urgency: 'regular',
          bedrooms: 3,
          bathrooms: 2,
          propertyType: 'apartment',
          additionalInstructions: 'Need deep cleaning before move-in. Focus on kitchen and bathrooms. Pet-friendly products preferred.'
        },
        createdAt: new Date('2024-06-23T08:00:00'),
        updatedAt: new Date('2024-06-23T08:00:00')
      },
      {
        customerId: customers[1].id,
        title: 'Weekly Office Cleaning',
        location: '456 Pine Avenue, Midtown, NY 10002',
        status: 'open',
        basePrice: '120.00',
        recurrence: 'weekly',
        scheduledAt: new Date('2024-06-25T09:00:00'),
        details: {
          urgency: 'regular',
          propertyType: 'office',
          additionalInstructions: 'Small office space, 5 desks, 1 conference room, kitchenette. Need weekly maintenance cleaning.'
        },
        createdAt: new Date('2024-06-22T14:30:00'),
        updatedAt: new Date('2024-06-22T14:30:00')
      },
      {
        customerId: customers[2].id,
        title: 'URGENT: Post-Party Cleanup',
        location: '789 Maple Drive, Brooklyn, NY 11201',
        status: 'open',
        basePrice: '200.00',
        recurrence: 'once',
        scheduledAt: new Date('2024-06-24T08:00:00'),
        details: {
          urgency: 'urgent',
          bedrooms: 4,
          bathrooms: 3,
          propertyType: 'house',
          additionalInstructions: 'Had a party last night. Need thorough cleaning ASAP. Kitchen is a mess, living areas need attention.'
        },
        createdAt: new Date('2024-06-23T23:45:00'),
        updatedAt: new Date('2024-06-23T23:45:00')
      },
      {
        customerId: customers[3].id,
        title: 'Move-Out Cleaning Service',
        location: '321 Cedar Lane, Queens, NY 11375',
        status: 'in_progress',
        basePrice: '180.00',
        recurrence: 'once',
        scheduledAt: new Date('2024-06-26T11:00:00'),
        details: {
          urgency: 'regular',
          bedrooms: 2,
          bathrooms: 1,
          propertyType: 'apartment',
          additionalInstructions: 'Moving out next week. Need thorough cleaning for security deposit return. Oven and fridge included.'
        },
        createdAt: new Date('2024-06-20T16:20:00'),
        updatedAt: new Date('2024-06-23T10:15:00')
      },
      {
        customerId: customers[0].id,
        title: 'Bi-weekly House Cleaning',
        location: '123 Oak Street, Downtown, NY 10001',
        status: 'open',
        basePrice: '140.00',
        recurrence: 'bi-weekly',
        scheduledAt: new Date('2024-06-28T14:00:00'),
        details: {
          urgency: 'regular',
          bedrooms: 3,
          bathrooms: 2,
          propertyType: 'apartment',
          additionalInstructions: 'Regular maintenance cleaning. We have two cats, so pet hair is an issue. Eco-friendly products only.'
        },
        createdAt: new Date('2024-06-21T12:00:00'),
        updatedAt: new Date('2024-06-21T12:00:00')
      },
      {
        customerId: customers[1].id,
        title: 'EMERGENCY: Water Damage Cleanup',
        location: '456 Pine Avenue, Midtown, NY 10002',
        status: 'open',
        basePrice: '300.00',
        recurrence: 'once',
        scheduledAt: new Date('2024-06-24T06:00:00'),
        details: {
          urgency: 'emergency',
          propertyType: 'apartment',
          additionalInstructions: 'Pipe burst in bathroom. Need immediate cleanup and sanitization. Water damage in bedroom and hallway.'
        },
        createdAt: new Date('2024-06-23T20:30:00'),
        updatedAt: new Date('2024-06-23T20:30:00')
      }
    ]);

    console.log('🏠 Created jobs');

    // Create Job Photos
    const jobPhotos = await JobPhoto.bulkCreate([
      // Photos for Deep Clean 3BR Apartment
      { jobId: jobs[0].id, photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      { jobId: jobs[0].id, photoUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
      { jobId: jobs[0].id, photoUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
      
      // Photos for Weekly Office Cleaning
      { jobId: jobs[1].id, photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400' },
      { jobId: jobs[1].id, photoUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400' },
      
      // Photos for Post-Party Cleanup
      { jobId: jobs[2].id, photoUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400' },
      { jobId: jobs[2].id, photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400' },
      { jobId: jobs[2].id, photoUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
      
      // Photos for Move-Out Cleaning
      { jobId: jobs[3].id, photoUrl: 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400' },
      { jobId: jobs[3].id, photoUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400' },
      
      // Photos for Bi-weekly House Cleaning
      { jobId: jobs[4].id, photoUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
      
      // Photos for Emergency Water Damage
      { jobId: jobs[5].id, photoUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400' },
      { jobId: jobs[5].id, photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400' }
    ]);

    console.log('📸 Created job photos');

    // Create Offers
    const offers = await Offer.bulkCreate([
      // Offers for Deep Clean 3BR Apartment
      {
        jobId: jobs[0].id,
        cleanerId: cleaners[0].id,
        amount: '145.00',
        status: 'sent',
        createdAt: new Date('2024-06-23T09:15:00'),
        updatedAt: new Date('2024-06-23T09:15:00')
      },
      {
        jobId: jobs[0].id,
        cleanerId: cleaners[1].id,
        amount: '150.00',
        status: 'sent',
        createdAt: new Date('2024-06-23T10:30:00'),
        updatedAt: new Date('2024-06-23T10:30:00')
      },
      {
        jobId: jobs[0].id,
        cleanerId: cleaners[4].id,
        amount: '140.00',
        status: 'sent',
        createdAt: new Date('2024-06-23T11:45:00'),
        updatedAt: new Date('2024-06-23T11:45:00')
      },
      
      // Offers for Weekly Office Cleaning
      {
        jobId: jobs[1].id,
        cleanerId: cleaners[1].id,
        amount: '115.00',
        status: 'sent',
        createdAt: new Date('2024-06-22T15:20:00'),
        updatedAt: new Date('2024-06-22T15:20:00')
      },
      {
        jobId: jobs[1].id,
        cleanerId: cleaners[2].id,
        amount: '120.00',
        status: 'sent',
        createdAt: new Date('2024-06-22T16:45:00'),
        updatedAt: new Date('2024-06-22T16:45:00')
      },
      
      // Offers for Post-Party Cleanup
      {
        jobId: jobs[2].id,
        cleanerId: cleaners[0].id,
        amount: '190.00',
        status: 'sent',
        createdAt: new Date('2024-06-24T00:30:00'),
        updatedAt: new Date('2024-06-24T00:30:00')
      },
      {
        jobId: jobs[2].id,
        cleanerId: cleaners[3].id,
        amount: '200.00',
        status: 'sent',
        createdAt: new Date('2024-06-24T01:15:00'),
        updatedAt: new Date('2024-06-24T01:15:00')
      },
      
      // Accepted offer for Move-Out Cleaning
      {
        jobId: jobs[3].id,
        cleanerId: cleaners[2].id,
        amount: '175.00',
        status: 'accepted',
        createdAt: new Date('2024-06-20T17:00:00'),
        updatedAt: new Date('2024-06-20T18:30:00')
      },
      
      // Offers for Emergency Water Damage
      {
        jobId: jobs[5].id,
        cleanerId: cleaners[0].id,
        amount: '280.00',
        status: 'sent',
        createdAt: new Date('2024-06-23T21:00:00'),
        updatedAt: new Date('2024-06-23T21:00:00')
      },
      {
        jobId: jobs[5].id,
        cleanerId: cleaners[4].id,
        amount: '295.00',
        status: 'sent',
        createdAt: new Date('2024-06-23T21:30:00'),
        updatedAt: new Date('2024-06-23T21:30:00')
      }
    ]);

    console.log('💰 Created offers');

    // Create Messages
    const messages = await Message.bulkCreate([
      // Messages for Deep Clean 3BR Apartment
      {
        senderId: cleaners[0].id,
        receiverId: customers[0].id,
        jobId: jobs[0].id,
        content: 'Hi Sarah! I saw your deep cleaning request. I have 5+ years of experience and can definitely help. My rate is $145 for this job. When would be the best time to start?',
        createdAt: new Date('2024-06-23T09:20:00'),
        updatedAt: new Date('2024-06-23T09:20:00')
      },
      {
        senderId: customers[0].id,
        receiverId: cleaners[0].id,
        jobId: jobs[0].id,
        content: 'Hi Maria! Thanks for your offer. Your rate sounds good. Do you have experience with pet-friendly cleaning products? We have two cats.',
        createdAt: new Date('2024-06-23T09:45:00'),
        updatedAt: new Date('2024-06-23T09:45:00')
      },
      {
        senderId: cleaners[0].id,
        receiverId: customers[0].id,
        jobId: jobs[0].id,
        content: 'Absolutely! I always use eco-friendly and pet-safe products. I have my own supplies. Would Sunday morning work for you?',
        createdAt: new Date('2024-06-23T10:00:00'),
        updatedAt: new Date('2024-06-23T10:00:00')
      },
      
      // Messages for Move-Out Cleaning (accepted job)
      {
        senderId: cleaners[2].id,
        receiverId: customers[3].id,
        jobId: jobs[3].id,
        content: 'Hi David! I can help with your move-out cleaning. I specialize in getting security deposits back. My rate is $175.',
        createdAt: new Date('2024-06-20T17:05:00'),
        updatedAt: new Date('2024-06-20T17:05:00')
      },
      {
        senderId: customers[3].id,
        receiverId: cleaners[2].id,
        jobId: jobs[3].id,
        content: 'Perfect! I accept your offer. When can you start? I need it done by Wednesday.',
        createdAt: new Date('2024-06-20T18:15:00'),
        updatedAt: new Date('2024-06-20T18:15:00')
      },
      {
        senderId: cleaners[2].id,
        receiverId: customers[3].id,
        jobId: jobs[3].id,
        content: 'Great! I can start Tuesday morning at 11 AM. I\'ll bring all supplies and should be done by 3 PM. See you then!',
        createdAt: new Date('2024-06-20T18:45:00'),
        updatedAt: new Date('2024-06-20T18:45:00')
      },
      {
        senderId: customers[3].id,
        receiverId: cleaners[2].id,
        jobId: jobs[3].id,
        content: 'Sounds perfect! I\'ll leave the keys with the building manager. Thanks Lisa!',
        createdAt: new Date('2024-06-21T08:30:00'),
        updatedAt: new Date('2024-06-21T08:30:00')
      },
      
      // Messages for Emergency Water Damage
      {
        senderId: cleaners[0].id,
        receiverId: customers[1].id,
        jobId: jobs[5].id,
        content: 'I can help with the emergency cleanup! I have experience with water damage. Can start at 6 AM tomorrow. Rate: $280',
        createdAt: new Date('2024-06-23T21:05:00'),
        updatedAt: new Date('2024-06-23T21:05:00')
      },
      {
        senderId: customers[1].id,
        receiverId: cleaners[0].id,
        jobId: jobs[5].id,
        content: 'Thank you! Do you have industrial fans and dehumidifiers? The water spread quite a bit.',
        createdAt: new Date('2024-06-23T21:15:00'),
        updatedAt: new Date('2024-06-23T21:15:00')
      },
      {
        senderId: cleaners[0].id,
        receiverId: customers[1].id,
        jobId: jobs[5].id,
        content: 'Yes, I have all the professional equipment needed. I\'ll also check for potential mold issues. See you at 6 AM sharp!',
        createdAt: new Date('2024-06-23T21:25:00'),
        updatedAt: new Date('2024-06-23T21:25:00')
      },
      
      // Messages for Post-Party Cleanup
      {
        senderId: cleaners[3].id,
        receiverId: customers[2].id,
        jobId: jobs[2].id,
        content: 'I can handle the post-party cleanup! I\'ve done many similar jobs. My rate is $200 and I can start early morning.',
        createdAt: new Date('2024-06-24T01:20:00'),
        updatedAt: new Date('2024-06-24T01:20:00')
      },
      {
        senderId: customers[2].id,
        receiverId: cleaners[3].id,
        jobId: jobs[2].id,
        content: 'That would be amazing! How early can you start? I have guests coming over again tonight 😅',
        createdAt: new Date('2024-06-24T01:35:00'),
        updatedAt: new Date('2024-06-24T01:35:00')
      }
    ]);

    console.log('💬 Created messages');

    // Create Payments
    const payments = await Payment.bulkCreate([
      // Payment for the accepted Move-Out Cleaning job
      {
        jobId: jobs[3].id,
        offerId: offers[7].id, // Lisa's accepted offer
        amount: '175.00',
        status: 'completed',
        transactionId: 'txn_1234567890',
        createdAt: new Date('2024-06-23T15:30:00'),
        updatedAt: new Date('2024-06-23T15:30:00')
      },
      
      // Pending payment for another job (simulating in-progress work)
      {
        jobId: jobs[0].id,
        offerId: offers[0].id, // Maria's offer for deep clean
        amount: '145.00',
        status: 'pending',
        transactionId: 'txn_pending_001',
        createdAt: new Date('2024-06-23T12:00:00'),
        updatedAt: new Date('2024-06-23T12:00:00')
      }
    ]);

    console.log('💳 Created payments');

    console.log('✅ Database seeding completed successfully!');
    console.log(`
📊 SUMMARY:
- Users: ${users.length} (${customers.length} customers, ${cleaners.length} cleaners)
- Jobs: ${jobs.length}
- Job Photos: ${jobPhotos.length}
- Offers: ${offers.length}
- Messages: ${messages.length}
- Payments: ${payments.length}
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run the seeder if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase; 