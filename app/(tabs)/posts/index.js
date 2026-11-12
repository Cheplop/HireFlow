
import { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../../components/PrimaryButton';
import { AuthInput } from '../../../components/AuthInput';
import { useAuth } from '../../../contexts/AuthContext';
import { useApplications } from '../../../contexts/ApplicationsContext';
import { useJobs } from '../../../contexts/JobsContext';

const brandColor = '#4B5694';
const employmentTypes = ['Full-time', 'Part-time', 'Contractual'];
const workModes = ['On-site', 'Remote', 'Hybrid'];

export default function Posts() {
    const { user } = useAuth();
    const { createJob, updateJob, deleteJob, getJobsForEmployer } = useJobs();
    const { deleteApplicationsForJob } = useApplications();
    const employerJobs = getJobsForEmployer(user.id);

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [responsibilities, setResponsibilities] = useState('');
    const [description, setDescription] = useState('');
    const [salary, setSalary] = useState('');
    const [employmentType, setEmploymentType] = useState(employmentTypes[0]);
    const [workMode, setWorkMode] = useState(workModes[0]);
    const [editingJob, setEditingJob] = useState(null);
    const [error, setError] = useState('');

    function saveJob() {
        const numericSalary = Number(salary);
        const responsibilityList = responsibilities
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean);

        if (!title.trim() || !company.trim() || !description.trim()) {
            setError('Enter a job title, company name, and description.');
            return;
        }

        if (!salary.trim() || !Number.isFinite(numericSalary) || numericSalary < 0) {
            setError('Enter a valid salary.');
            return;
        }

        setError('');
        const jobData = {
            jobTitle: title.trim(),
            jobCompany: company.trim(),
            jobLocation: location.trim(),
            jobDescription: description.trim(),
            responsibilities: responsibilityList,
            salary: numericSalary,
            jobMode: employmentType,
            jobType: workMode,
            companyLogo: editingJob?.companyLogo || require('../../../assets/images/Hireflow.png'),
        };

        try {
            if (editingJob) {
                updateJob(editingJob.id, user.id, jobData);
            } else {
                createJob(user.id, jobData);
            }
            cancelEditing();
        } catch (saveError) {
            setError(saveError.message);
        }
    }

    function startEditing(job) {
        setEditingJob(job);
        setTitle(job.jobTitle);
        setCompany(job.jobCompany);
        setLocation(job.jobLocation || '');
        setDescription(job.jobDescription || '');
        setResponsibilities((job.responsibilities || []).join('\n'));
        setSalary(String(job.salary ?? ''));
        setEmploymentType(job.jobMode || employmentTypes[0]);
        setWorkMode(job.jobType || workModes[0]);
        setError('');
    }

    function cancelEditing() {
        setEditingJob(null);
        setTitle('');
        setCompany('');
        setLocation('');
        setDescription('');
        setResponsibilities('');
        setSalary('');
        setEmploymentType(employmentTypes[0]);
        setWorkMode(workModes[0]);
        setError('');
    }

    function handleDelete(job) {
        try {
            deleteApplicationsForJob(job.id, user.id);
            deleteJob(job.id, user.id);
            if (editingJob?.id === job.id) cancelEditing();
            setError('');
        } catch (deleteError) {
            setError(deleteError.message);
        }
    }

    function renderJob({ item }) {
        return (
            <View style={styles.postCard}>
                <View style={styles.postHeader}>
                    <Image source={item.companyLogo} style={styles.postImage} />

                    <View style={styles.postInfo}>
                        <Text style={styles.postTitle}>
                            {item.jobTitle}
                        </Text>
                        <Text style={styles.mutedText}>{item.jobCompany}</Text>
                        <Text style={styles.postPrice}>
                            ₱{Number(item.salary || 0).toLocaleString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.postActions}>
                    <View style={styles.actionButton}>
                        <PrimaryButton
                            title="Edit"
                            variant="secondary"
                            onPress={() => startEditing(item)}
                        />
                    </View>

                    <View style={styles.actionButton}>
                        <PrimaryButton
                            title="Delete"
                            variant="secondary"
                            onPress={() => handleDelete(item)}
                        />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={employerJobs}
                keyExtractor={item => String(item.id)}
                renderItem={renderJob}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View>
                        <Text style={styles.screenTitle}>
                            My Jobs
                        </Text>

                        <Text style={styles.screenSubtitle}>
                            Publish and manage your job listings.
                        </Text>

                        <View style={styles.formCard}>
                            <Text style={styles.formTitle}>
                                {editingJob ? 'Edit Job' : 'Create Job'}
                            </Text>

                            <Text style={styles.formSubtitle}>
                                {editingJob
                                    ? 'Update the details for this listing.'
                                    : 'Add the details for a new job listing.'}
                            </Text>

                            {error ? (
                                <View style={styles.errorBox}>
                                    <Text style={styles.errorText}>
                                        {error}
                                    </Text>
                                </View>
                            ) : null}

                            <View style={styles.inputGroup}>
                                <AuthInput
                                    label="Job title"
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Enter a job title"
                                />

                                <AuthInput
                                    label="Company name"
                                    value={company}
                                    onChangeText={setCompany}
                                    placeholder="Enter a company name"
                                />

                                <AuthInput
                                    label="Location (optional)"
                                    value={location}
                                    onChangeText={setLocation}
                                    placeholder="City, country or remote"
                                />

                                <AuthInput
                                    label="Job description"
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Describe the job"
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    style={styles.multilineInput}
                                />

                                <AuthInput
                                    label="Responsibilities (one per line)"
                                    value={responsibilities}
                                    onChangeText={setResponsibilities}
                                    placeholder="Add each responsibility on a new line"
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    style={styles.multilineInput}
                                />

                                <AuthInput
                                    label="Salary"
                                    value={salary}
                                    onChangeText={setSalary}
                                    placeholder="Enter salary"
                                    keyboardType="decimal-pad"
                                />

                                <Text style={styles.inputLabel}>Employment type</Text>
                                <View style={styles.optionRow}>
                                    {employmentTypes.map((type) => (
                                        <PrimaryButton
                                            key={type}
                                            title={type}
                                            variant={employmentType === type ? 'active' : 'inactive'}
                                            onPress={() => setEmploymentType(type)}
                                            style={styles.optionButton}
                                        />
                                    ))}
                                </View>

                                <Text style={styles.inputLabel}>Work mode</Text>
                                <View style={styles.optionRow}>
                                    {workModes.map((mode) => (
                                        <PrimaryButton
                                            key={mode}
                                            title={mode}
                                            variant={workMode === mode ? 'active' : 'inactive'}
                                            onPress={() => setWorkMode(mode)}
                                            style={styles.optionButton}
                                        />
                                    ))}
                                </View>
                            </View>

                            <View style={styles.formButton}>
                                <PrimaryButton
                                    title={editingJob ? 'Save Changes' : 'Publish Job'}
                                    onPress={saveJob}
                                />
                            </View>

                            {editingJob ? (
                                <PrimaryButton
                                    title="Cancel Editing"
                                    variant="secondary"
                                    onPress={cancelEditing}
                                />
                            ) : null}
                        </View>

                        <View style={styles.listHeading}>
                            <Text style={styles.sectionTitle}>
                                Your published jobs
                            </Text>

                            <Text style={styles.productCount}>
                                {employerJobs.length} jobs
                            </Text>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        No jobs yet. Publish your first listing above.
                    </Text>
                }
                ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FC',
    },

    listContent: {
        padding: 20,
        paddingBottom: 35,
    },

    screenTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#252A40',
    },

    screenSubtitle: {
        fontSize: 14,
        color: '#777D90',
        marginTop: 5,
        marginBottom: 22,
    },

    formCard: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E9EBF3',
        gap: 12,
    },

    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#252A40',
    },

    formSubtitle: {
        fontSize: 13,
        color: '#777D90',
        marginTop: -5,
    },

    inputGroup: {
        gap: 12,
        marginTop: 5,
    },

    inputLabel: {
        color: '#252A40',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: -8,
    },

    multilineInput: {
        minHeight: 100,
    },

    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    optionButton: {
        width: 'auto',
        paddingHorizontal: 10,
        paddingVertical: 8,
    },

    formButton: {
        marginTop: 5,
    },

    errorBox: {
        backgroundColor: '#FFF0F0',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F2CCCC',
    },

    errorText: {
        color: '#B42318',
        fontSize: 13,
    },

    listHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 28,
        marginBottom: 14,
    },

    sectionTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#252A40',
    },

    productCount: {
        fontSize: 12,
        color: brandColor,
        fontWeight: '600',
    },

    postCard: {
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9EBF3',
        gap: 14,
    },

    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },

    postImage: {
        width: 85,
        height: 85,
        borderRadius: 10,
        backgroundColor: '#F0F2F8',
        resizeMode: 'contain',
    },

    noImage: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    mutedText: {
        fontSize: 11,
        color: '#777D90',
    },

    postInfo: {
        flex: 1,
        gap: 5,
    },

    postId: {
        fontSize: 12,
        color: '#777D90',
    },

    postTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#252A40',
    },

    postPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: brandColor,
    },

    postActions: {
        flexDirection: 'row',
        gap: 8,
    },

    actionButton: {
        flex: 1,
    },

    separator: {
        height: 12,
    },

    emptyText: {
        textAlign: 'center',
        color: '#777D90',
        paddingVertical: 25,
    },

    loading: {
        padding: 20,
        color: '#252A40',
    },
});
